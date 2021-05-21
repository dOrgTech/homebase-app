import { Parser, Expr } from "@taquito/michel-codec";
import {
  dtoToVoters,
  extractRegistryTransfersData,
  mapFA2TransfersArgs,
  mapProposalRegistryList,
  mapXTZTransfersArgs,
} from "./../../../bakingBad/proposals/mappers";
import { TezosToolkit } from "@taquito/taquito";
import { Schema } from "@taquito/michelson-encoder";
import { getLedgerAddresses } from "services/bakingBad/ledger";
import { getOriginationTime } from "services/bakingBad/operations";
import { getProposalsDTO } from "services/bakingBad/proposals";
import { getStorage } from "services/bakingBad/storage";
import { Network } from "services/beacon/context";
import { ConstructorParams, getContract, TransferParams } from "..";
import { DAOListMetadata } from "../../metadataCarrier/types";
import { BaseDAO } from "..";
import {
  PMRegistryUpdateProposal,
  PMTransferProposal,
  ProposalMetadata,
  RegistryExtra,
  RegistryExtraDTO,
  RegistryItem,
} from "./types";
import {
  RegistryUpdateProposal,
  TransferProposal,
} from "services/bakingBad/proposals/types";
import { getExtra } from "services/bakingBad/extra";
import { bytes2Char } from "@taquito/tzip16";
import proposeCode from "./michelson/propose";

const parser = new Parser();

interface RegistryConstructorParams extends ConstructorParams {
  extra: RegistryExtra;
}

interface RegistryItemDTO {
  prim: "Pair";
  args: [{ string: string }, { string: string }];
}

const mapStorageRegistryList = (
  listMichelsonString: string
): {
  key: string;
  value: string;
}[] => {
  if (listMichelsonString === "{ {} }") {
    return [];
  }

  const listStringNoBraces = listMichelsonString.substr(
    3,
    listMichelsonString.length - 6
  );
  return listStringNoBraces.split(" ; ").map((listString) => {
    const list = parser.parseData(listString) as RegistryItemDTO;

    return {
      key: bytes2Char(list.args[0].string),
      value: bytes2Char(list.args[1].string),
    };
  });
};

export class RegistryDAO extends BaseDAO {
  public extra: RegistryExtra;

  public static create = async (
    contractAddress: string,
    network: Network,
    tezos: TezosToolkit,
    metadata: DAOListMetadata
  ) => {
    const storage = await getStorage(contractAddress, network);
    const extraDto = await getExtra<RegistryExtraDTO>(
      storage.extraMapNumber,
      network
    );
    const extra = {
      registry: mapStorageRegistryList(extraDto[0].data.value.value),
      frozenExtraValue: Number(extraDto[4].data.value.value),
      slashExtraValue: Number(extraDto[5].data.value.value),
      minXtzAmount: Number(extraDto[6].data.value.value),
      maxXtzAmount: Number(extraDto[7].data.value.value),
      frozenScaleValue: Number(extraDto[8].data.value.value),
      slashDivisionScale: Number(extraDto[9].data.value.value),
    };
    const ledger = await getLedgerAddresses(storage.ledgerMapNumber, network);
    const originationTime = await getOriginationTime(contractAddress, network);

    return new RegistryDAO({
      address: contractAddress,
      ledger,
      template: "registry",
      originationTime,
      storage,
      metadata,
      tezos,
      network,
      extra,
    });
  };

  public constructor(params: RegistryConstructorParams) {
    super(params);
    this.extra = params.extra;
  }

  public proposeRegistryUpdate = async ({
    tokensToFreeze,
    agoraPostId,
    items,
  }: {
    tokensToFreeze: number;
    agoraPostId: number;
    items: RegistryItem[];
  }) => {
    const contract = await getContract(this.tezos, this.address);

    const michelsonType = parser.parseData(proposeCode);
    const schema = new Schema(michelsonType as Expr);

    const diff = items.map((item) => [item.key, item.newValue]);
    const data = schema.Encode({
      normal_proposal: {
        agora_post_id: agoraPostId,
        registry_diff: diff,
      },
    });

    const { packed: proposalMetadata } = await this.tezos.rpc.packData({
      data,
      type: michelsonType as Expr,
    });

    const contractMethod = contract.methods.propose(
      tokensToFreeze,
      proposalMetadata
    );

    const result = await contractMethod.send();

    return result;
  };

  public proposeTransfer = async ({
    tokensToFreeze,
    agoraPostId,
    transfers,
  }: {
    tokensToFreeze: number;
    agoraPostId: number;
    transfers: TransferParams[];
  }) => {
    const contract = await getContract(this.tezos, this.address);

    const michelsonType = parser.parseData(proposeCode);

    const schema = new Schema(michelsonType as Expr);
    const data = schema.Encode({
      transfer_proposal: {
        agora_post_id: agoraPostId,
        transfers: transfers.map((transfer) => {
          if (transfer.type === "FA2") {
            return {
              token_transfer_type: mapFA2TransfersArgs(transfer, this.address),
            };
          } else {
            return {
              xtz_transfer_type: mapXTZTransfersArgs(transfer),
            };
          }
        }),
      }
    });

    const { packed: proposalMetadata } = await this.tezos.rpc.packData({
      data,
      type: michelsonType as Expr,
    });

    const contractMethod = contract.methods.propose(
      tokensToFreeze,
      proposalMetadata
    );

    const result = await contractMethod.send();
    return result;
  };

  public proposals = async (): Promise<
    (TransferProposal | RegistryUpdateProposal)[]
  > => {
    const { proposalsMapNumber } = this.storage;
    const proposalsDTO = await getProposalsDTO(
      proposalsMapNumber,
      this.network
    );

    const schema = new Schema(parser.parseData(proposeCode) as Expr);

    const proposals = proposalsDTO.map((dto) => {
      const proposalMetadata = dto.data.value.children[1].value;

      const proposalMetadataNoBraces = proposalMetadata.substr(
        2,
        proposalMetadata.length - 4
      );
      const michelsonExpr = parser.parseData(proposalMetadataNoBraces);
      const proposalMetadataDTO: ProposalMetadata = schema.Execute(
        michelsonExpr
      );

      if(proposalMetadataDTO.hasOwnProperty("transfer_proposal")) {
        const { agoraPostId, transfers } = extractRegistryTransfersData(
          proposalMetadataDTO as PMTransferProposal
        );

        return {
          id: dto.data.key.value,
          upVotes: Number(dto.data.value.children[7].value),
          downVotes: Number(dto.data.value.children[0].value),
          startDate: dto.data.value.children[6].value,
          agoraPostId: agoraPostId.toString(),
          proposer: dto.data.value.children[3].value,
          proposerFrozenTokens: dto.data.value.children[5].value,
          transfers,
          cycle: Number(dto.data.value.children[2].value),
          voters: dtoToVoters(dto.data.value.children[8]),
          type: "transfer" as const,
        };
      } else {
        const { agoraPostId, registryDiff } = mapProposalRegistryList(proposalMetadataDTO as PMRegistryUpdateProposal)

        return {
          id: dto.data.key.value,
          upVotes: Number(dto.data.value.children[7].value),
          downVotes: Number(dto.data.value.children[0].value),
          startDate: dto.data.value.children[6].value,
          agoraPostId: agoraPostId,
          proposer: dto.data.value.children[3].value,
          proposerFrozenTokens: dto.data.value.children[5].value,
          list: registryDiff,
          cycle: Number(dto.data.value.children[2].value),
          voters: dtoToVoters(dto.data.value.children[8]),
          type: "registryUpdate" as const,
        };
      }
      
    });

    return proposals;
  };
}
