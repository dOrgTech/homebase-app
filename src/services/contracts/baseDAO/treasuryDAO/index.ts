import {
  TezosToolkit,
} from "@taquito/taquito";

import { getLedgerAddresses } from "services/bakingBad/ledger";
import { getOriginationTime } from "services/bakingBad/operations";
import { getProposalsDTO } from "services/bakingBad/proposals";
import { getStorage } from "services/bakingBad/storage";
import { Network } from "services/beacon/context";
import { DAOListMetadata } from "../../metadataCarrier/types";

import { BaseDAO } from "..";
import { TransferProposal, TransferProposalsDTO } from "services/bakingBad/proposals/types";
import { dtoToTransferProposals } from "services/bakingBad/proposals/mappers";
import { TreasuryExtraDTO } from "./types";
import { getExtra } from "services/bakingBad/extra";

export class TreasuryDAO extends BaseDAO {
  public static create = async (
    contractAddress: string,
    network: Network,
    tezos: TezosToolkit,
    metadata: DAOListMetadata
  ) => {
    const storage = await getStorage(contractAddress, network);
    const extraDTO = await getExtra<TreasuryExtraDTO>(storage.extraMapNumber, network)
    const extra = {
      frozenExtraValue: Number(extraDTO[1].data.value.value),
      slashExtraValue: Number(extraDTO[2].data.value.value),
      minXtzAmount: Number(extraDTO[3].data.value.value),
      maxXtzAmount: Number(extraDTO[4].data.value.value),
      frozenScaleValue: Number(extraDTO[5].data.value.value),
      slashDivisionScale: Number(extraDTO[6].data.value.value),
    }
    const ledger = await getLedgerAddresses(storage.ledgerMapNumber, network);
    const originationTime = await getOriginationTime(contractAddress, network);

    return new TreasuryDAO({
      address: contractAddress,
      ledger,
      template: "treasury",
      originationTime,
      storage,
      metadata,
      tezos,
      extra,
      network,
    });
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
