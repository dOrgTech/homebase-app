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
import { getProposals } from "services/bakingBad/proposals";
import { ProposalStatus } from "services/bakingBad/proposals/types";
import { getStorage } from "services/bakingBad/storage";
import {
  RegistryStorage,
  RegistryStorageDTO,
} from "services/bakingBad/storage/types";
import { Network } from "services/beacon/context";
import { getContract } from "..";
import { getDAOListMetadata } from "../metadataCarrier";
import { MetadataDeploymentResult } from "../metadataCarrier/deploy";
import { DAOListMetadata } from "../metadataCarrier/types";
import { fromStateToRegistryStorage, deployRegistryDAO } from "../registryDAO";
import { MigrationParams } from "../types";
import { BaseConstructorParams, BaseDAO } from ".";

interface RegistryConstructorParams extends BaseConstructorParams {
  storage: RegistryStorage;
}

export interface RegistryDeployParams {
  params: MigrationParams;
  metadata: MetadataDeploymentResult;
  tezos: TezosToolkit;
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
        registry: dto.children[8].children[0].value,
        frozenScaleValue: Number(dto.children[8].children[1].value),
        frozenExtraValue: Number(dto.children[8].children[2].value),
        slashScaleValue: Number(dto.children[8].children[3].value),
        slashDivisionValue: Number(dto.children[8].children[4].value),
        minXtzAmount: dto.children[8].children[4].value,
        maxXtzAmount: dto.children[8].children[5].value,
        maxProposalSize: Number(dto.children[8].children[5].value),
        proposalsMapNumber: dto.children[9].value,
      };

      return result;
    } catch (e) {
      throw new Error(
        `Storage mapping failed in RegistryDAO. Probably was wrongly instantiated? Error: ${e}`
      );
    }
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
    const registryParams = fromStateToRegistryStorage(params);

    return await deployRegistryDAO({
      storage: registryParams,
      metadataCarrierDeploymentData: metadata,
      tezos,
    });
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

  public proposals = async () => {
    const { proposalsMapNumber } = this.storage;
    const proposals = await getProposals(proposalsMapNumber, this.network);

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
}
