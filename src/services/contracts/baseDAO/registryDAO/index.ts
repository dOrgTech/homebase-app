import { Parser, Expr } from "@taquito/michel-codec";
import {
  extractRegistryTransfersData,
  mapProposalBase,
  mapProposalRegistryList,
  mapTransfersArgs,
} from "./../../../bakingBad/proposals/mappers";
import { TezosToolkit } from "@taquito/taquito";
import { Schema } from "@taquito/michelson-encoder";
import { getLedgerAddresses } from "services/bakingBad/ledger";
import { getOriginationTime } from "services/bakingBad/operations";
import { getProposalsDTO } from "services/bakingBad/proposals";
import { getStorage } from "services/bakingBad/storage";
import { Network } from "services/beacon/context";
import { ConstructorParams, getContract } from "..";
import { DAOListMetadata } from "../../metadataCarrier/types";
import { BaseDAO } from "..";
import {
  PMRegistryProposal,
  PMTreasuryProposal,
  ProposalMetadata,
  RegistryExtra,
  RegistryExtraDTO,
  RegistryProposeArgs,
} from "./types";
import { RegistryProposal, Transfer } from "services/bakingBad/proposals/types";
import { getExtra } from "services/bakingBad/extra";
import { bytes2Char, char2Bytes } from "@taquito/tzip16";
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

  public propose = async ({
    agoraPostId,
    transfer_proposal,
    normal_proposal,
  }: RegistryProposeArgs) => {
    const contract = await getContract(this.tezos, this.address);

    const michelsonType = parser.parseData(proposeCode);
    const schema = new Schema(michelsonType as Expr);
    const dataToEncode: Record<string, any> = {};

    if (!transfer_proposal && !normal_proposal) {
      throw new Error("No proposal arguments passed");
    }

    if (transfer_proposal) {
      dataToEncode.transfer_proposal = {
        transfers: mapTransfersArgs(transfer_proposal.transfers, this.address),
        agora_post_id: agoraPostId,
      };
    }

    if (normal_proposal) {
      dataToEncode.configuration_proposal = {
        normal_proposal: {
          registry_diff: normal_proposal.registry_diff.map((item) => [
            char2Bytes(item.key),
            char2Bytes(item.value),
          ]),
          agora_post_id: agoraPostId,
        },
      };
    }

    const data = schema.Encode(dataToEncode);

    const { packed: proposalMetadata } = await this.tezos.rpc.packData({
      data,
      type: michelsonType as Expr,
    });

    const contractMethod = contract.methods.propose(
      this.extra.frozenExtraValue,
      proposalMetadata
    );

    const result = await contractMethod.send();

    return result;
  };

  public proposals = async (): Promise<RegistryProposal[]> => {
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

      let agoraPostId = "0";
      let transfers: Transfer[] = [];
      let list: {
        key: string;
        value: string;
      }[] = [];

      if (proposalMetadataDTO.hasOwnProperty("transfer_proposal")) {
        const extracted = extractRegistryTransfersData(
          proposalMetadataDTO as PMTreasuryProposal
        );

        agoraPostId = extracted.agoraPostId;
        transfers = extracted.transfers;
      }

      if (proposalMetadataDTO.hasOwnProperty("configuration_proposal")) {
        const extracted = mapProposalRegistryList(
          proposalMetadataDTO as PMRegistryProposal
        );

        agoraPostId = extracted.agoraPostId;
        list = extracted.registryDiff;
      }

      return {
        ...mapProposalBase(dto, "registry"),
        transfers,
        list,
        agoraPostId,
      };
    });

    return proposals as any;
  };
}
