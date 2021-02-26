import { ProposalWithStatus } from "./../../../bakingBad/proposals/types";
import { TezosToolkit, ContractAbstraction, Wallet } from "@taquito/taquito";
import { DAOTemplate } from "modules/creator/state";
import { getLedgerAddresses } from "services/bakingBad/ledger";
import { Ledger } from "services/bakingBad/ledger/types";
import { BaseStorage } from "services/bakingBad/storage/types";
import { Network } from "services/beacon/context";
import { getContract } from "..";
import { getDAOListMetadata } from "../metadataCarrier";
import { DAOListMetadata } from "../metadataCarrier/types";
import {
  RegistryDAO,
  RegistryDeployParams,
  TreasuryDAO,
  TreasuryDeployParams,
} from ".";
import { getProposalVotes } from "services/bakingBad/operations";

type DeployParams = TreasuryDeployParams | RegistryDeployParams;

export interface BaseConstructorParams {
  address: string;
  network: Network;
  ledger: Ledger;
  template: DAOTemplate;
  cycle: number;
  originationTime: string;
  storage: BaseStorage;
  metadata: DAOListMetadata;
  tezos: TezosToolkit;
}

export abstract class BaseDAO {
  public address;
  public ledger;
  public template;
  public cycle;
  public originationTime;
  public storage;
  public metadata;
  public tezos;
  public network;

  // abstract propose: (...args: any[]) => Promise<TransactionWalletOperation>;
  // abstract vote: (...args: any[]) => Promise<TransactionWalletOperation>;

  abstract proposals: () => Promise<ProposalWithStatus[]>;

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

  public static baseDeploy = async (
    template: DAOTemplate,
    params: DeployParams
  ): Promise<ContractAbstraction<Wallet>> => {
    switch (template) {
      case "treasury":
        return TreasuryDAO.deploy(params as TreasuryDeployParams);
      case "registry":
        return RegistryDAO.deploy(params as RegistryDeployParams);
      default:
        throw new Error("Unrecognized DAO type. This should never happen");
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

    return await Promise.all(
      addresses.map(async (address) => {
        return await BaseDAO.getDAO({
          address,
          tezos,
          network,
        });
      })
    );
  };

  protected constructor(params: BaseConstructorParams) {
    this.address = params.address;
    this.ledger = params.ledger;
    this.template = params.template;
    this.cycle = params.cycle;
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

  public votes = (proposalKey: string) =>
    getProposalVotes(this.address, this.network, proposalKey);

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

    const result = await contract.methods
      .vote([
        {
          proposal_key: proposalKey,
          vote_type: support,
          vote_amount: amount,
        },
      ])
      .send();

    return result;
  };
}
