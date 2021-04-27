import { Proposal } from "../../bakingBad/proposals/types";
import { TezosToolkit, ContractAbstraction, Wallet, MichelsonMap } from "@taquito/taquito";
import { DAOTemplate } from "modules/creator/state";
import { getLedgerAddresses } from "services/bakingBad/ledger";
import { Ledger } from "services/bakingBad/ledger/types";
import { BaseStorage } from "services/bakingBad/storage/types";
import { Network } from "services/beacon/context";
import { DAOParams, fromStateToBaseStorage, getContract, MigrationParams, TransferParams } from ".";
import { getDAOListMetadata } from "../metadataCarrier";
import { DAOListMetadata } from "../metadataCarrier/types";
import {
  RegistryDAO,
  TreasuryDAO,
} from ".";
import { MetadataDeploymentResult } from "../metadataCarrier/deploy";
import { generateMorleyContracts } from "services/morley";
import { getOriginatedAddress } from "services/bakingBad/originatorContract";
import { Schema } from "@taquito/michelson-encoder";
import { xtzToMutez } from "services/contracts/utils";
import { Parser, Expr } from "@taquito/michel-codec";

const parser = new Parser();

interface DeployParams {
  params: MigrationParams;
  metadata: MetadataDeploymentResult;
  tezos: TezosToolkit;
  network: Network;
}

export type CycleType = "voting" | "proposing"

export interface CycleInfo {
  time: number;
  current: number;
  type: CycleType;
}

export interface BaseConstructorParams {
  address: string;
  network: Network;
  ledger: Ledger;
  template: DAOTemplate;
  originationTime: string;
  storage: BaseStorage;
  metadata: DAOListMetadata;
  tezos: TezosToolkit;
}

export abstract class BaseDAO {
  public address;
  public ledger;
  public template;
  public originationTime;
  public storage;
  public metadata;
  public tezos;
  public network;

  abstract proposals: () => Promise<Proposal[]>;

  public static getDAO = async (params: {
    address: string;
    network: Network;
    tezos: TezosToolkit;
  }): Promise<BaseDAO> => {
    const { address, network, tezos } = params;
    const contract = await getContract(tezos, address);
    const metadata = await getDAOListMetadata(contract);
    const template = metadata.template;

    let instance: any;

    const prefetched = {
      metadata,
      contract,
    };

    switch (template) {
      case "treasury":
        instance = await TreasuryDAO.create(
          address,
          network,
          tezos,
          prefetched
        );
        break;
      case "registry":
        instance = await RegistryDAO.create(
          address,
          network,
          tezos,
          prefetched
        );
        break;
      default:
        throw new Error("Unrecognized DAO type. This should never happen");
    }

    return instance;
  };

  private static fromStateToStorage = (
    info: MigrationParams
  ): DAOParams["storage"] => {
    const storageData = fromStateToBaseStorage(info);
  
    return storageData;
  };

  public static baseDeploy = async (
    template: DAOTemplate,
    { params, metadata, tezos, network }: DeployParams,
  ): Promise<ContractAbstraction<Wallet>> => {
    const treasuryParams = BaseDAO.fromStateToStorage(params);

    if (!metadata.deployAddress) {
      throw new Error(
        "Error deploying treasury DAO: There's not address of metadata"
      );
    }

    const account = await tezos.wallet.pkh()

    try {
      console.log("Originating Morley contracts");
      const morleyContracts = await generateMorleyContracts({
        template, 
        storage: treasuryParams,
        originatorAddress: account,
        metadata
      })
      console.log("Originating DAO contract...");
  
      const t = await tezos.wallet.originate({
        code: morleyContracts.steps.originator,
        init: morleyContracts.steps.storage
      })
        
      const operation = await t.send();
      console.log("Waiting for confirmation on DAO contract...", t);
      const { address: originatorAddress } = await operation.contract();
      const originatorContract = await tezos.wallet.at(originatorAddress)

      for (const lambda of morleyContracts.steps.lambdas) {
        const op = await originatorContract.methods.load_lambda(lambda).send()
        await op.confirmation(1)
      }

      const runLambdaOp = await originatorContract.methods.run_lambda([["unit"]]).send()
      await runLambdaOp.confirmation(1)

      const originatedAddress = await getOriginatedAddress(originatorAddress, network)

      return await tezos.wallet.at(originatedAddress);
    } catch (e) {
      console.log("error ", e);
      throw new Error("Error deploying DAO");
    }
  };

  public static getDAOs = async (
    addresses: string[],
    tezos: TezosToolkit | undefined,
    network: Network
  ) => {
    if (!tezos) {
      return [];
    }

    const results = await Promise.all(
      addresses.map(async (address) => {
        try {
          const dao = await BaseDAO.getDAO({
            address,
            tezos,
            network,
          });

          return dao;
        } catch (e) {
          console.log(e);
          return false;
        }
      })
    );

    return results;
  };

  protected constructor(params: BaseConstructorParams) {
    this.address = params.address;
    this.ledger = params.ledger;
    this.template = params.template;
    this.originationTime = params.originationTime;
    this.storage = params.storage;
    this.metadata = params.metadata;
    this.tezos = params.tezos;
    this.network = params.network;
  }

  public flush = async (numerOfProposalsToFlush: number) => {
    const contract = await getContract(this.tezos, this.address);

    const result = await contract.methods.flush(numerOfProposalsToFlush).send();
    return result;
  };

  public setTezos = (tezos: TezosToolkit) => {
    this.tezos = tezos;
  };

  public abstract fetchStorage: () => Promise<BaseStorage>;

  public tokenHolders = async () => {
    const storage = await this.fetchStorage();
    const ledger = await getLedgerAddresses(
      storage.ledgerMapNumber,
      this.network
    );
    return ledger;
  };

  public vote = async ({
    proposalKey,
    amount,
    support,
  }: {
    proposalKey: string;
    amount: number;
    support: boolean;
  }) => {
    const contract = await getContract(this.tezos, this.address);

    console.log(proposalKey,
      amount,
      support)
    const result = await contract.methods
      .vote([{
        argument: {
          proposal_key: proposalKey,
          vote_type: support,
          vote_amount: amount,
        },
      }
      ])
      .send();

    return result;
  };

  public freeze = async (amount: number) => {
    const contract = await getContract(this.tezos, this.address);

    const result = await contract.methods.freeze(amount).send();
    return result;
  };

  public unfreeze = async (amount: number) => {
    const contract = await getContract(this.tezos, this.address);

    const result = await contract.methods.unfreeze(amount).send();
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
