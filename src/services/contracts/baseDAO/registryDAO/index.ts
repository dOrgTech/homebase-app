import { Parser, Expr } from "@taquito/michel-codec";
import {
  dtoToRegistryUpdateProposals,
  dtoToTransferProposals,
} from "./../../../bakingBad/proposals/mappers";
import {
  TezosToolkit,
  MichelsonMap,
} from "@taquito/taquito";
import { Schema } from "@taquito/michelson-encoder";
import { getLedgerAddresses } from "services/bakingBad/ledger";
import { getOriginationTime } from "services/bakingBad/operations";
import { getProposalsDTO } from "services/bakingBad/proposals";
import { getStorage } from "services/bakingBad/storage";
import { Network } from "services/beacon/context";
import { ConstructorParams, getContract } from "..";
import { DAOListMetadata } from "../../metadataCarrier/types";
import { BaseDAO } from "..";
import { RegistryExtra, RegistryExtraDTO, RegistryItem } from "./types";
import {
  RegistryProposalsDTO,
  RegistryUpdateProposal,
  RegistryUpdateProposalsDTO,
  TransferProposal,
  TransferProposalsDTO,
} from "services/bakingBad/proposals/types";
import { getExtra } from "services/bakingBad/extra";
import { bytes2Char } from "@taquito/tzip16";

const parser = new Parser();

interface RegistryConstructorParams extends ConstructorParams {
  extra: RegistryExtra
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
  if(listMichelsonString === "{ {} }") {
    return []
  }

  const listStringNoBraces = listMichelsonString.substr(3, listMichelsonString.length - 6)
  return listStringNoBraces.split(" ; ").map(listString => {
    const list = parser.parseData(listString) as RegistryItemDTO;

    return { 
      key: bytes2Char(list.args[0].string),
      value: bytes2Char(list.args[1].string)
    }
  })
};

export class RegistryDAO extends BaseDAO {
  public extra: RegistryExtra

  public static create = async (
    contractAddress: string,
    network: Network,
    tezos: TezosToolkit,
    metadata: DAOListMetadata
  ) => {
    const storage = await getStorage(contractAddress, network);
    const extraDto = await getExtra<RegistryExtraDTO>(storage.extraMapNumber, network)
    const extra = {
      registry: mapStorageRegistryList(extraDto[0].data.value.value),
      frozenExtraValue: Number(extraDto[4].data.value.value),
      slashExtraValue: Number(extraDto[5].data.value.value),
      minXtzAmount: Number(extraDto[6].data.value.value),
      maxXtzAmount: Number(extraDto[7].data.value.value),
      frozenScaleValue: Number(extraDto[8].data.value.value),
      slashDivisionScale: Number(extraDto[9].data.value.value),
    }
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
      extra
    });
  };

  public constructor(params: RegistryConstructorParams) {
    super(params)
    this.extra = params.extra
  }

  public proposals = async (): Promise<
    (TransferProposal | RegistryUpdateProposal)[]
  > => {
    const { proposalsMapNumber } = this.storage;
    const proposalsDTO = (await getProposalsDTO(
      proposalsMapNumber,
      this.network
    )) as RegistryProposalsDTO;

    const proposals = proposalsDTO.map((dto: RegistryProposalsDTO[number]) => {
      if (dto.data.value.children[1].children[1].name === "transfers") {
        return dtoToTransferProposals(dto as TransferProposalsDTO[number]);
      } else {
        return dtoToRegistryUpdateProposals(
          dto as RegistryUpdateProposalsDTO[number]
        );
      }
    });

    return proposals;
  };

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

    const michelsonType = parser.parseData(
      `(list (pair (string %registry_key) (option %registry_value (string))))`
    );
    const schema = new Schema(michelsonType as Expr);

    const diff = items.map(
      ({ key: registry_key, newValue: registry_value }) => ({
        registry_key,
        registry_value,
      })
    );
    const data = schema.Encode(diff);

    const michelsonType2 = parser.parseData("(nat)") as Expr;
    const schema2 = new Schema(michelsonType2 as Expr);
    const data2 = schema2.Encode([agoraPostId]);

    const { packed: pack1 } = await this.tezos.rpc.packData({
      data,
      type: michelsonType as Expr,
    });

    const { packed: pack2 } = await this.tezos.rpc.packData({
      data: data2,
      type: michelsonType2,
    });

    const proposalMetadata = new MichelsonMap();
    proposalMetadata.set("agoraPostID", pack2);
    proposalMetadata.set("updates", pack1);

    const contractMethod = contract.methods.propose(
      tokensToFreeze,
      proposalMetadata
    );

    const result = await contractMethod.send();

    return result;
  };
}
