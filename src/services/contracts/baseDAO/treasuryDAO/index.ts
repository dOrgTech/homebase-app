import { generateMorleyContracts } from './../../../morley/index';
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
import { BaseConstructorParams, fromStateToBaseStorage, getContract, setMembersAllocation, setMetadata } from "..";
import { getDAOListMetadata } from "../../metadataCarrier";
import { MetadataDeploymentResult } from "../../metadataCarrier/deploy";
import { DAOListMetadata } from "../../metadataCarrier/types";
import { MigrationParams, Transfer } from "../types";
import { BaseDAO } from "..";
import { dtoToTreasuryProposals } from "services/bakingBad/proposals/mappers";
import { TreasuryParams } from './types';

export interface TreasuryDeployParams {
  params: MigrationParams;
  metadata: MetadataDeploymentResult;
  tezos: TezosToolkit;
}

interface TreasuryConstructorParams extends BaseConstructorParams {
  storage: TreasuryStorage;
}

export class TreasuryDAO extends BaseDAO {
  public storage;

  private static storageMapper = (dto: TreasuryStorageDTO): TreasuryStorage => {
    try {
      const result = {
        ledgerMapNumber: dto.children[0].value,
        votingPeriod: Number(dto.children[6].value),
        quorumTreshold: Number(dto.children[7].value),
        frozenScaleValue: Number(dto.children[8].children[0].value),
        frozenExtraValue: Number(dto.children[8].children[1].value),
        slashScaleValue: Number(dto.children[8].children[2].value),
        slashDivisionValue: Number(dto.children[8].children[3].value),
        minXtzAmount: dto.children[8].children[4].value,
        maxXtzAmount: dto.children[8].children[5].value,
        maxProposalSize: Number(dto.children[8].children[6].value),
        proposalsMapNumber: dto.children[9].value,
        proposalsToFlush: dto.children[10].children,
      };

      return result;
    } catch (e) {
      throw new Error(
        `Storage mapping failed in RegistryDAO. Probably was wrongly instantiated? Error: ${e}`
      );
    }
  };

  private static fromStateToStorage = (
    info: MigrationParams
  ): TreasuryParams["storage"] => {
    const storageData = fromStateToBaseStorage(info);
  
    return storageData;
  };

  public static deploy = async ({
    params,
    metadata,
    tezos,
  }: {
    params: MigrationParams;
    metadata: MetadataDeploymentResult;
    tezos: TezosToolkit;
  }) => {
    const treasuryParams = TreasuryDAO.fromStateToStorage(params);

    if (!metadata.deployAddress) {
      throw new Error(
        "Error deploying treasury DAO: There's not address of metadata"
      );
    }

    const ledger = setMembersAllocation(treasuryParams.membersTokenAllocation);
    const metadataObj = setMetadata(metadata);
    const account = await tezos.wallet.pkh()
    console.log("ACCOUNT: " + account)

    try {
      console.log("Originating Morley contracts");
      const morleyContracts = await generateMorleyContracts("treasury", treasuryParams, account)
      console.log("Originating Treasury DAO contract...");
  
      const t = await tezos.wallet.originate({
        code: morleyContracts.steps.originator,
        init: morleyContracts.steps.storage
      })
        
      const operation = await t.send();
      console.log("Waiting for confirmation on Treasury DAO contract...", t);
      const { address: originatorAddress } = await operation.contract();
      const originatorContract = await tezos.wallet.at(originatorAddress)
      await originatorContract.methods.load_lambda(morleyContracts.steps.lambda1).send()
      await originatorContract.methods.load_lambda(morleyContracts.steps.lambda2).send()
      await originatorContract.methods.run_lambda([["unit"]]).send()
      return originatorContract;
    } catch (e) {
      console.log("error ", e);
      throw new Error("Error deploying Treasury DAO");
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
