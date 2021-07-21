import {
  TezosToolkit,
  ContractAbstraction,
  Wallet,
  TransactionWalletOperation,
} from "@taquito/taquito";
import { DAOTemplate, MigrationParams } from "modules/creator/state";
import { Network } from "services/beacon/context";
import { fromStateToBaseStorage, getContract } from ".";
import { MetadataDeploymentResult } from "../metadataCarrier/deploy";
import { generateStorageContract } from "services/baseDAODocker";
import baseDAOContractCode from "./michelson/baseDAO";
import { formatUnits, xtzToMutez } from "../utils";
import { BigNumber } from "bignumber.js";
import { TokenMetadata } from "services/bakingBad/tokens";
import { LedgerDTO, ProposalDTO } from "services/indexer/types";
import { Proposal } from "services/bakingBad/proposals/types";

interface DeployParams {
  params: MigrationParams;
  metadata: MetadataDeploymentResult;
  tezos: TezosToolkit;
  network: Network;
}

export type CycleType = "voting" | "proposing";

export interface CycleInfo {
  time: number;
  current: number;
  type: CycleType;
}

export interface BaseDAOData {
  id: number;
  admin: string;
  address: string;
  frozen_token_id: number;
  token: TokenMetadata;
  guardian: string;
  ledger: LedgerDTO[]
  proposals: ProposalDTO[]
  max_proposals: string;
  max_quorum_change: string;
  max_quorum_threshold: string;
  max_votes: string;
  min_quorum_threshold: string;
  period: string;
  proposal_expired_time: string;
  proposal_flush_time: string;
  quorum_change: string;
  last_updated_cycle: string;
  quorum_threshold: string;
  staked: string;
  start_time: string;
  name: string;
  description: string;
  type: DAOTemplate
  network: Network;
}

export abstract class BaseDAO {
  abstract proposals: (network: Network) => Promise<Proposal[]>;
  abstract proposal: (proposalKey: string, network: Network) => Promise<Proposal>;

  public static baseDeploy = async (
    template: DAOTemplate,
    { params, metadata, tezos, network }: DeployParams
  ): Promise<ContractAbstraction<Wallet>> => {
    const treasuryParams = fromStateToBaseStorage(params);

    if (!metadata.deployAddress) {
      throw new Error(
        "Error deploying treasury DAO: There's not address of metadata"
      );
    }

    const account = await tezos.wallet.pkh();

    try {
      console.log("Making storage contract...");
      const storageCode = await generateStorageContract({
        network,
        template,
        storage: treasuryParams,
        originatorAddress: account,
        metadata,
      });
      console.log("Originating DAO contract...");

      const t = await tezos.wallet.originate({
        code: baseDAOContractCode,
        init: storageCode,
      });

      const operation = await t.send();
      console.log("Waiting for confirmation on DAO contract...", t);
      const { address } = await operation.contract();

      return await tezos.wallet.at(address);
    } catch (e) {
      console.log("error ", e);
      throw new Error("Error deploying DAO");
    }
  };

  protected constructor(public data: BaseDAOData) { }

  public flush = async (
    numerOfProposalsToFlush: number,
    tezos: TezosToolkit
  ) => {
    const daoContract = await getContract(tezos, this.data.address);
    const operation = await daoContract.methods.flush(numerOfProposalsToFlush);

    const result = await operation.send();
    return result;
  };

  public dropProposal = async (proposalId: string, tezos: TezosToolkit) => {
    const contract = await getContract(tezos, this.data.address);

    const result = await contract.methods.drop_proposal(proposalId).send();
    return result;
  };

  public sendXtz = async (xtzAmount: BigNumber, tezos: TezosToolkit) => {
    const contract = await getContract(tezos, this.data.address);

    const result = await contract.methods.callCustom("receive_xtz", "").send({
      amount: xtzToMutez(xtzAmount).toNumber(),
      mutez: true,
    });
    return result;
  };

  public vote = async ({
    proposalKey,
    amount,
    support,
    tezos,
  }: {
    proposalKey: string;
    amount: BigNumber;
    support: boolean;
    tezos: TezosToolkit;
  }) => {
    const contract = await getContract(tezos, this.data.address);
    const result = await contract.methods
      .vote([
        {
          argument: {
            proposal_key: proposalKey,
            vote_type: support,
            vote_amount: formatUnits(amount, this.data.token.decimals).toString(),
          },
        },
      ])
      .send();

    return result;
  };

  public freeze = async (amount: BigNumber, tezos: TezosToolkit) => {
    const daoContract = await getContract(tezos, this.data.address);
    const govTokenContract = await getContract(
      tezos,
      this.data.token.contract
    );
    const tokenMetadata = this.data.token;
    const batch = await tezos.wallet
      .batch()
      .withContractCall(
        govTokenContract.methods.update_operators([
          {
            add_operator: {
              owner: await tezos.wallet.pkh(),
              operator: this.data.address,
              token_id: this.data.token.token_id,
            },
          },
        ])
      )
      .withContractCall(
        daoContract.methods.freeze(formatUnits(amount, tokenMetadata.decimals).toString())
      )
      .withContractCall(
        govTokenContract.methods.update_operators([
          {
            remove_operator: {
              owner: await tezos.wallet.pkh(),
              operator: this.data.address,
              token_id: this.data.token.token_id,
            },
          },
        ])
      );

    const result = await batch.send();
    return result;
  };

  public unfreeze = async (amount: BigNumber, tezos: TezosToolkit) => {
    const contract = await getContract(tezos, this.data.address);

    const result = await contract.methods
      .unfreeze(formatUnits(amount, this.data.token.decimals).toString())
      .send();
    return result;
  };

  public abstract propose(...args: any[]): Promise<TransactionWalletOperation>;
}
