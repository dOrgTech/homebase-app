import { ProposalWithStatus } from "../../bakingBad/proposals/types";
import { TezosToolkit, ContractAbstraction, Wallet } from "@taquito/taquito";
import { DAOTemplate } from "modules/creator/state";
import { getLedgerAddresses } from "services/bakingBad/ledger";
import { Ledger } from "services/bakingBad/ledger/types";
import { BaseStorage } from "services/bakingBad/storage/types";
import { Network } from "services/beacon/context";
import { DAOParams, fromStateToBaseStorage, getContract, MigrationParams } from ".";
import { getDAOListMetadata } from "../metadataCarrier";
import { DAOListMetadata } from "../metadataCarrier/types";
import {
  RegistryDAO,
  TreasuryDAO,
} from ".";
import { getProposalVotes } from "services/bakingBad/operations";
import { MetadataDeploymentResult } from "../metadataCarrier/deploy";
import { generateMorleyContracts } from "services/morley";
import { getOriginatedAddress } from "services/bakingBad/originatorContract";

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

    return results.filter((result) => typeof result !== "boolean") as BaseDAO[];
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
