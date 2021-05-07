import {
  TezosToolkit,
} from "@taquito/taquito";

import { getLedgerAddresses } from "services/bakingBad/ledger";
import { getOriginationTime } from "services/bakingBad/operations";
import { getProposalsDTO } from "services/bakingBad/proposals";
import { getStorage } from "services/bakingBad/storage";
import {
  TreasuryStorageDTO,
  TreasuryStorage,
} from "services/bakingBad/storage/types";
import { Network } from "services/beacon/context";
import { BaseConstructorParams } from "..";
import { getDAOListMetadata } from "../../metadataCarrier";
import { DAOListMetadata } from "../../metadataCarrier/types";

import { BaseDAO } from "..";
import { TransferProposal, TransferProposalsDTO } from "services/bakingBad/proposals/types";
import { dtoToTransferProposals } from "services/bakingBad/proposals/mappers";

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
        frozenExtraValue: Number(dto.children[1].children[0].value),
        maxProposalSize: Number(dto.children[1].children[2].value),
        votingPeriod: Number(dto.children[17].value),
        quorumTreshold: (Number(dto.children[15].children[0].value) + Number(dto.children[15].children[1].value)) * Number(dto.children[13].children[0].value) / Number(dto.children[13].children[1].value),
        proposalsMapNumber: dto.children[12].value,
        ledgerMapNumber: dto.children[6].value,
        lastPeriodChange: {
          timestamp: dto.children[5].children[0].value,
          periodNumber: Number(dto.children[5].children[1].value),
        },
        proposalsToFlush: dto.children[11].value,
        totalSupply: {
          0: Number(dto.children[15].children[0].value),
          1: Number(dto.children[15].children[1].value),
        },
        fixedProposalFeeInToken: Number(dto.children[2].value),
        admin: dto.children[0].value,
        maxXtzAmount: dto.children[1].children[3].value,
        minXtzAmount: dto.children[1].children[4].value,
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
      metadata?: DAOListMetadata;
    }
  ) => {
    const storageDTO = (await getStorage(
      contractAddress,
      network
    )) as TreasuryStorageDTO;
    const storage = TreasuryDAO.storageMapper(storageDTO);
    const metadataToUse =
      (prefetched && prefetched.metadata) ||
      (await getDAOListMetadata(contractAddress, tezos));
    const ledger = await getLedgerAddresses(storage.ledgerMapNumber, network);
    const originationTime = await getOriginationTime(contractAddress, network);

    return new TreasuryDAO({
      address: contractAddress,
      ledger,
      template: "treasury",
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

  public proposals = async (): Promise<TransferProposal[]> => {
    const { proposalsMapNumber } = this.storage;
    const proposalsDTO = await getProposalsDTO(
      proposalsMapNumber,
      this.network
    );

    const proposals = proposalsDTO.map((dto) => dtoToTransferProposals(dto as TransferProposalsDTO[number]));

    return proposals;
  };

}
