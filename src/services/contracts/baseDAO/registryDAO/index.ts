import { getRegistry } from "./../../../bakingBad/registry/index";
import { RegistryProposalWithStatus } from "./../../../bakingBad/proposals/types";
import { dtoToRegistryProposals } from "./../../../bakingBad/proposals/mappers";
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
  RegistryProposalsDTO,
} from "services/bakingBad/proposals/types";
import { getStorage } from "services/bakingBad/storage";
import {
  RegistryStorage,
  RegistryStorageDTO,
} from "services/bakingBad/storage/types";
import { Network } from "services/beacon/context";
import { getContract } from "..";
import { getDAOListMetadata } from "../../metadataCarrier";
import { DAOListMetadata } from "../../metadataCarrier/types";
import { BaseConstructorParams, BaseDAO } from "..";
import { RegistryItem } from "./types";

interface RegistryConstructorParams extends BaseConstructorParams {
  storage: RegistryStorage;
}

export class RegistryDAO extends BaseDAO {
  protected constructor(params: RegistryConstructorParams) {
    super(params);

    this.storage = params.storage;
  }

  private static storageMapper = (dto: RegistryStorageDTO): RegistryStorage => {
    try {
      const result = {
        ledgerMapNumber: dto.children[0].value,
        votingPeriod: Number(dto.children[6].value),
        quorumTreshold: Number(dto.children[7].value),
        registryMapNumber: Number(dto.children[8].children[0].value),
        proposalReceivers: dto.children[8].children[1],
        frozenScaleValue: Number(dto.children[8].children[2].value),
        frozenExtraValue: Number(dto.children[8].children[3].value),
        slashScaleValue: Number(dto.children[8].children[4].value),
        slashDivisionValue: Number(dto.children[8].children[5].value),
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
    )) as RegistryStorageDTO;
    const storage = RegistryDAO.storageMapper(storageDTO);
    const metadataToUse =
      (prefetched && prefetched.metadata) ||
      (await getDAOListMetadata(contract));
    const ledger = await getLedgerAddresses(storage.ledgerMapNumber, network);
    const originationTime = await getOriginationTime(contractAddress, network);
    const cycle = Math.floor(
      (dayjs().unix() - dayjs(originationTime).unix()) / storage.votingPeriod
    );

    return new RegistryDAO({
      address: contractAddress,
      ledger,
      template: "registry",
      cycle,
      originationTime,
      storage,
      metadata: metadataToUse,
      tezos,
      network,
    });
  };

  public fetchStorage = async (): Promise<RegistryStorage> => {
    const storageDTO = await getStorage(this.address, this.network);
    return RegistryDAO.storageMapper(storageDTO as RegistryStorageDTO);
  };

  public proposals = async (): Promise<RegistryProposalWithStatus[]> => {
    const { proposalsMapNumber } = this.storage;
    const proposalsDTO = (await getProposalsDTO(
      proposalsMapNumber,
      this.network
    )) as RegistryProposalsDTO;

    const proposals = dtoToRegistryProposals(proposalsDTO);

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
    items,
  }: {
    tokensToFreeze: number;
    agoraPostId: number;
    items: RegistryItem[];
  }) => {
    const contract = await getContract(this.tezos, this.address);

    const diff = items.map(({ key, newValue }) => ({
      key,
      new_value: newValue,
    }));

    console.log(contract.entrypoints.entrypoints);

    const contractMethod = contract.methods.propose(
      tokensToFreeze,
      "proposal_type",
      agoraPostId,
      diff
    );

    const result = await contractMethod.send();

    return result;
  };

  public getRegistry = async () => {
    const { registryMapNumber } = await this.fetchStorage();

    const registry = await getRegistry(registryMapNumber, this.network);

    return registry;
  };
}
