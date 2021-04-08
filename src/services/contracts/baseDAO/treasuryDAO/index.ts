import {
  TezosToolkit,
  ContractAbstraction,
  Wallet,
  ContractProvider,
} from "@taquito/taquito";
import { Tzip16ContractAbstraction } from "@taquito/tzip16";
import dayjs from "dayjs";
import { getLedgerAddresses } from "services/bakingBad/ledger";
import { getOriginationTime } from "services/bakingBad/operations";
import { getProposalsDTO } from "services/bakingBad/proposals";
import {
  ProposalStatus,
  TreasuryProposalsDTO,
  TreasuryProposalWithStatus,
} from "services/bakingBad/proposals/types";
import { getStorage } from "services/bakingBad/storage";
import {
  TreasuryStorageDTO,
  TreasuryStorage,
} from "services/bakingBad/storage/types";
import { Network } from "services/beacon/context";
import { BaseConstructorParams, getContract } from "..";
import { getDAOListMetadata } from "../../metadataCarrier";
import { DAOListMetadata } from "../../metadataCarrier/types";
import {  Transfer } from "../types";
import { BaseDAO } from "..";
import { dtoToTreasuryProposals } from "services/bakingBad/proposals/mappers";

interface TreasuryConstructorParams extends BaseConstructorParams {
  storage: TreasuryStorage;
}

export class TreasuryDAO extends BaseDAO {
  public storage;

  private static storageMapper = (dto: TreasuryStorageDTO): TreasuryStorage => {
    try {
      const result = {
        slashDivisionValue: Number(dto.children[1].children[5].value),
        slashScaleValue: Number(dto.children[1].children[6].value),
        maxProposalSize: Number(dto.children[1].children[2].value),
        votingPeriod: Number(dto.children[18].value),
        quorumTreshold: Number(dto.children[14].value),
        proposalsMapNumber: dto.children[13].value,
        ledgerMapNumber: dto.children[6].value,
        proposalsToFlush: dto.children[12].value,
        totalSupply: {
          0: Number(dto.children[16].children[0].value),
          1: Number(dto.children[16].children[1].value)
        },
        fixedProposalFeeInToken: Number(dto.children[2].value),
        admin: dto.children[0].value,
        maxXtzAmount: dto.children[1].children[3].value,
        minXtzAmount: dto.children[1].children[4].value
      };

      return result;
    } catch (e) {
      throw new Error(
        `Storage mapping failed in TreasuryDAO. Probably was wrongly instantiated? Error: ${e}`
      );
    }
  };

  public static create = async (
    contractAddress: string,
    network: Network,
    tezos: TezosToolkit,
    prefetched?: {
      contract?: ContractAbstraction<Wallet> & {
        tzip16(
          this: ContractAbstraction<Wallet | ContractProvider>
        ): Tzip16ContractAbstraction;
      };
      metadata?: DAOListMetadata;
    }
  ) => {
    const contract =
      (prefetched && prefetched.contract) ||
      (await getContract(tezos, contractAddress));
    const storageDTO = (await getStorage(
      contractAddress,
      network
    )) as TreasuryStorageDTO;
    const storage = TreasuryDAO.storageMapper(storageDTO);
    const metadataToUse =
      (prefetched && prefetched.metadata) ||
      (await getDAOListMetadata(contract));
    const ledger = await getLedgerAddresses(storage.ledgerMapNumber, network);
    const originationTime = await getOriginationTime(contractAddress, network);
    const cycle = Math.floor(
      (dayjs().unix() - dayjs(originationTime).unix()) / storage.votingPeriod
    );

    return new TreasuryDAO({
      address: contractAddress,
      ledger,
      template: "treasury",
      cycle,
      originationTime,
      storage,
      metadata: metadataToUse,
      tezos,
      network,
    });
  };

  protected constructor(params: TreasuryConstructorParams) {
    super(params);

    this.storage = params.storage;
  }

  public fetchStorage = async (): Promise<TreasuryStorage> => {
    const storageDTO = await getStorage(this.address, this.network);
    return TreasuryDAO.storageMapper(storageDTO as TreasuryStorageDTO);
  };

  public proposals = async (): Promise<TreasuryProposalWithStatus[]> => {
    const { proposalsMapNumber } = this.storage;
    const proposalsDTO = await getProposalsDTO(
      proposalsMapNumber,
      this.network
    );

    const proposals = dtoToTreasuryProposals(
      proposalsDTO as TreasuryProposalsDTO
    );

    return proposals.map((proposal) => {
      const { startDate, upVotes, downVotes } = proposal;

      const exactCycle =
        dayjs(startDate).unix() - dayjs(this.originationTime).unix();
      const cycle = Math.floor(exactCycle / this.storage.votingPeriod);

      //TODO: this business logic will change in the future

      let status: ProposalStatus;

      if (cycle === this.cycle) {
        status = ProposalStatus.ACTIVE;
      } else if (Number(upVotes) >= this.storage.quorumTreshold) {
        status = ProposalStatus.PASSED;
      } else if (Number(downVotes) >= this.storage.quorumTreshold) {
        status = ProposalStatus.REJECTED;
      } else {
        status = ProposalStatus.DROPPED;
      }

      return {
        ...proposal,
        cycle,
        status,
      };
    });
  };

  public propose = async ({
    tokensToFreeze,
    agoraPostId,
    transfers,
  }: {
    tokensToFreeze: number;
    agoraPostId: number;
    transfers: Transfer[];
  }) => {
    const contract = await getContract(this.tezos, this.address);

    const contractMethod = contract.methods.propose(
      tokensToFreeze,
      agoraPostId,
      [
        {
          transfer_fa2: {
            contract_address: "KT19yUiYtyCdW6pLh7eBfDEpAkQj8SAV6ZrN",
            transfer_list: [
              {
                from_: "tz1RKPcdraL3D3SQitGbvUZmBoqefepxRW1x",
                txs: [
                  {
                    to_: "tz1Zqb3hBBN8wLcJYhADcasi1jZdp2YLdG3L",
                    token_id: 0,
                    amount: 5,
                  },
                ],
              },
            ],
          },
        },
      ]
    );

    const result = await contractMethod.send();

    return result;
  };
}
