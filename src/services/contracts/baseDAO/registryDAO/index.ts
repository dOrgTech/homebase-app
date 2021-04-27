import { Parser, Expr } from "@taquito/michel-codec";
import {
  dtoToRegistryUpdateProposals,
  dtoToTransferProposals,
} from "./../../../bakingBad/proposals/mappers";
import {
  TezosToolkit,
  ContractAbstraction,
  Wallet,
  ContractProvider,
  MichelsonMap,
} from "@taquito/taquito";
import { Schema } from "@taquito/michelson-encoder";
import { bytes2Char, Tzip16ContractAbstraction } from "@taquito/tzip16";
import { getLedgerAddresses } from "services/bakingBad/ledger";
import { getOriginationTime } from "services/bakingBad/operations";
import { getProposalsDTO } from "services/bakingBad/proposals";
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
import {
  RegistryProposalsDTO,
  RegistryUpdateProposal,
  RegistryUpdateProposalsDTO,
  TransferProposal,
  TransferProposalsDTO,
} from "services/bakingBad/proposals/types";

interface RegistryConstructorParams extends BaseConstructorParams {
  storage: RegistryStorage;
}

const parser = new Parser();

const mapStorageRegistryList = (
  listMichelsonString: string
): {
  key: string;
  value: string;
}[] => {
  if(listMichelsonString === "{ { } }") {
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

interface RegistryItemDTO {
  prim: "Pair";
  args: [{ string: string }, { string: string }];
}

export class RegistryDAO extends BaseDAO {
  storage: RegistryStorage;

  protected constructor(params: RegistryConstructorParams) {
    super(params);

    this.storage = params.storage;
  }

  private static storageMapper = (dto: RegistryStorageDTO): RegistryStorage => {
    try {
      const result = {
        slashDivisionValue: Number(dto.children[1].children[8].value),
        slashScaleValue: Number(dto.children[1].children[9].value),
        frozenExtraValue: Number(dto.children[1].children[0].value),
        maxProposalSize: Number(dto.children[1].children[2].value),
        proposalReceivers: dto.children[1].children[5].value,
        lastPeriodChange: {
          timestamp: dto.children[5].children[0].value,
          periodNumber: Number(dto.children[5].children[1].value),
        },
        registry: mapStorageRegistryList(dto.children[1].children[6].value),
        registryAffected: dto.children[1].children[7].value,
        votingPeriod: Number(dto.children[17].value),
        quorumTreshold: (Number(dto.children[15].children[0].value) + Number(dto.children[15].children[1].value)) * Number(dto.children[13].children[0].value) / Number(dto.children[13].children[1].value),
        proposalsMapNumber: dto.children[12].value,
        ledgerMapNumber: dto.children[6].value,
        proposalsToFlush: dto.children[11].value || [],
        totalSupply: {
          0: Number(dto.children[15].children[0].value),
          1: Number(dto.children[15].children[1].value),
        },
        fixedProposalFeeInToken: Number(dto.children[2].value),
        admin: dto.children[0].value,
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

    return new RegistryDAO({
      address: contractAddress,
      ledger,
      template: "registry",
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
