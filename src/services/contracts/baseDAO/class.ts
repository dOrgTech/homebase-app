import { Proposal } from "../../bakingBad/proposals/types";
import { TezosToolkit, ContractAbstraction, Wallet, MichelsonMap } from "@taquito/taquito";
import { DAOTemplate } from "modules/creator/state";
import { getLedgerAddresses } from "services/bakingBad/ledger";
import { Ledger } from "services/bakingBad/ledger/types";
import { getStorage } from "services/bakingBad/storage";
import { Network } from "services/beacon/context";
import { Extra, fromStateToBaseStorage, getContract, MigrationParams } from ".";
import { DAOListMetadata } from "../metadataCarrier/types";
import {
  RegistryDAO,
  TreasuryDAO,
} from ".";
import { MetadataDeploymentResult } from "../metadataCarrier/deploy";
import { generateStorageContract } from "services/morley";
import { getDAOListMetadata } from "../metadataCarrier";
import baseDAOContractCode from "./michelson/baseDAO"
import { getMetadataFromAPI } from "services/bakingBad/metadata";
import { Storage } from "services/bakingBad/storage/types";

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

export interface ConstructorParams {
  address: string;
  network: Network;
  ledger: Ledger;
  template: DAOTemplate;
  originationTime: string;
  storage: Storage;
  metadata: DAOListMetadata;
  tezos: TezosToolkit;
  extra: Extra
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
  public extra;

  abstract proposals: () => Promise<Proposal[]>;

  public static getDAO = async (params: {
    address: string;
    network: Network;
    tezos: TezosToolkit;
  }): Promise<BaseDAO> => {
    const { address, network, tezos } = params;
    const metadata = await getMetadataFromAPI(address, network)

    let instance: any;

    switch (metadata.template) {
      case "treasury":
        instance = await TreasuryDAO.create(
          address,
          network,
          tezos,
          metadata
        );
        break;
      case "registry":
        instance = await RegistryDAO.create(
          address,
          network,
          tezos,
          metadata
        );
        break;
      default:
        throw new Error("Unrecognized DAO type. This should never happen");
    }

    return instance;
  };

  public static baseDeploy = async (
    template: DAOTemplate,
    { params, metadata, tezos }: DeployParams,
  ): Promise<ContractAbstraction<Wallet>> => {
    const treasuryParams = fromStateToBaseStorage(params);

    if (!metadata.deployAddress) {
      throw new Error(
        "Error deploying treasury DAO: There's not address of metadata"
      );
    }

    const account = await tezos.wallet.pkh()

    try {
      console.log("Making storage contract...");
      const storageCode = await generateStorageContract({
        template, 
        storage: treasuryParams,
        originatorAddress: account,
        metadata
      })
      console.log("Originating DAO contract...");
  
      const t = await tezos.wallet.originate({
        code: baseDAOContractCode,
        init: storageCode
      })
        
      const operation = await t.send();
      console.log("Waiting for confirmation on DAO contract...", t);
      const { address } = await operation.contract();

      return await tezos.wallet.at(address);
    } catch (e) {
      console.log("error ", e);
      throw new Error("Error deploying DAO");
    }
  };

  public static getDAOs = async (
    addresses: string[],
    tezos: TezosToolkit | undefined
  ): Promise<(DAOListMetadata | false)[]> => {
    if (!tezos) {
      return [];
    }

    const results = await Promise.all(
      addresses.map(async (address) => {
        try {

          const metadata = await getDAOListMetadata(address, tezos)

          return metadata;
        } catch (e) {
          console.log(e);
          return false;
        }
      })
    );

    return results;
  };

  protected constructor(params: ConstructorParams) {
    this.address = params.address;
    this.ledger = params.ledger;
    this.template = params.template;
    this.originationTime = params.originationTime;
    this.storage = params.storage;
    this.metadata = params.metadata;
    this.tezos = params.tezos;
    this.network = params.network;
    this.extra = params.extra;
  }

  public flush = async (numerOfProposalsToFlush: number) => {
    const contract = await getContract(this.tezos, this.address);

    const result = await contract.methods.flush(numerOfProposalsToFlush).send();
    return result;
  };

  public setTezos = (tezos: TezosToolkit) => {
    this.tezos = tezos;
  };

  public tokenHolders = async () => {
    const storage = await getStorage(this.address, this.network);
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

}
