import {
  TezosToolkit,
  ContractAbstraction,
  Wallet,
  ContractProvider,
  MichelsonMap,
} from "@taquito/taquito";
import { Tzip16ContractAbstraction } from "@taquito/tzip16";
import { Parser, Expr } from "@taquito/michel-codec";
import { getLedgerAddresses } from "services/bakingBad/ledger";
import { getOriginationTime } from "services/bakingBad/operations";
import { getProposalsDTO } from "services/bakingBad/proposals";
import {
  TreasuryProposal,
  TreasuryProposalsDTO,
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
import { TransferParams } from "../types";
import { BaseDAO } from "..";
import { dtoToTreasuryProposals } from "services/bakingBad/proposals/mappers";
import { Schema } from "@taquito/michelson-encoder";
import { xtzToMutez } from "services/contracts/utils";

const parser = new Parser();

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
        quorumTreshold: Number(dto.children[13].value),
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

  public proposals = async (): Promise<TreasuryProposal[]> => {
    const { proposalsMapNumber } = this.storage;
    const proposalsDTO = await getProposalsDTO(
      proposalsMapNumber,
      this.network
    );

    const proposals = dtoToTreasuryProposals(
      proposalsDTO as TreasuryProposalsDTO
    );

    return proposals;
  };

  public propose = async ({
    tokensToFreeze,
    agoraPostId,
    transfers,
  }: {
    tokensToFreeze: number;
    agoraPostId: number;
    transfers: TransferParams[];
  }) => {
    const contract = await getContract(this.tezos, this.address);

    const michelsonType = parser.parseData(`(list (or (pair %xtz_transfer_type (mutez %amount) (address %recipient))
    (pair %token_transfer_type
       (address %contract_address)
       (list %transfer_list
          (pair (address %from_)
                (list %txs (pair (address %to_) (pair (nat %token_id) (nat %amount)))))))))`);
    const schema = new Schema(michelsonType as Expr);
    const data = schema.Encode(transfers.map(transfer => {
      if(transfer.type === "XTZ") {
        return {
          xtz_transfer_type: {
            amount: Number(xtzToMutez(transfer.amount.toString())),
            recipient: transfer.recipient,
          }
        }
      } else {
        return {
          token_transfer_type: {
            contract_address: transfer.asset.contract,
            transfer_list: [
              {
                from_: this.address,
                txs: [
                  {
                    to_: transfer.recipient,
                    token_id: transfer.asset.token_id,
                    amount: transfer.amount * Math.pow(10, transfer.asset.decimals),
                  },
                ],
              },
            ],
          }
        }
      }
    }))

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
    proposalMetadata.set("transfers", pack1);

    const contractMethod = contract.methods.propose(tokensToFreeze, proposalMetadata);

    const result = await contractMethod.send();
    return result;
  };
}
