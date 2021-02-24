import {
  deployRegistryDAO,
  fromStateToRegistryStorage,
} from "./registryDAO/index";
import { MetadataDeploymentResult } from "./metadataCarrier/deploy";
import {
  deployTreasuryDAO,
  fromStateToTreasuryStorage,
} from "services/contracts/baseDAO/treasuryDAO";
import { DAOTemplate } from "./../../../modules/creator/state/types";
import { TezosToolkit } from "@taquito/taquito";
import { tzip16 } from "@taquito/tzip16";
import dayjs from "dayjs";

import { getLedgerAddresses } from "services/bakingBad/ledger";
import { getStorage } from "services/bakingBad/storage";
import { Network } from "services/beacon/context";
import { getDAOListMetadata } from "services/contracts/baseDAO/metadataCarrier";
import {
  DAOItem,
  FlushParams,
  MigrationParams,
  ProposeParams,
  VoteParams,
} from "services/contracts/baseDAO/types";
import { getProposals } from "services/bakingBad/proposals";
import {
  ProposalStatus,
  ProposalWithStatus,
} from "services/bakingBad/proposals/types";
import { Ledger } from "services/bakingBad/ledger/types";
import { getOriginationTime } from "services/bakingBad/operations";

const getContract = async (tezos: TezosToolkit, contractAddress: string) => {
  return await tezos.wallet.at(contractAddress, tzip16);
};

export const getDAOs = async (
  addresses: string[],
  tezos: TezosToolkit | undefined,
  network: Network
): Promise<DAOItem[]> => {
  if (!tezos) {
    return [];
  }

  return await Promise.all(
    addresses.map(async (address) =>
      getDAOInfoFromContract(address, tezos, network)
    )
  );
};

export const getDAOInfoFromContract = async (
  contractAddress: string,
  tezos: TezosToolkit,
  network: Network
): Promise<DAOItem> => {
  const contract = await getContract(tezos, contractAddress);
  const { storage, template } = await getStorage(contractAddress, network);
  const metadata = await getDAOListMetadata(contract);
  const ledger = await getLedgerAddresses(storage.ledgerMapNumber, network);
  const originationTime = await getOriginationTime(contractAddress, network);
  const cycle = Math.floor(
    (dayjs().unix() - dayjs(originationTime).unix()) / storage.votingPeriod
  );

  return {
    ...metadata,
    template,
    address: contractAddress,
    ...storage,
    ledger,
    cycle,
    originationTime,
  };
};

export const getDAOProposals = async (
  dao: DAOItem,
  network: Network
): Promise<ProposalWithStatus[]> => {
  const { proposalsMapNumber, originationTime } = dao;
  const proposals = await getProposals(proposalsMapNumber, network);

  return proposals.map((proposal) => {
    const { votingPeriod, cycle: daoCycle, quorumTreshold } = dao;
    const { startDate, upVotes, downVotes } = proposal;

    const exactCycle = dayjs(startDate).unix() - dayjs(originationTime).unix();
    const cycle = Math.floor(exactCycle / votingPeriod);

    //TODO: this business logic will change in the future

    let status: ProposalStatus;

    if (cycle === daoCycle) {
      status = ProposalStatus.ACTIVE;
    } else if (Number(upVotes) >= quorumTreshold) {
      status = ProposalStatus.PASSED;
    } else if (Number(downVotes) >= quorumTreshold) {
      status = ProposalStatus.REJECTED;
    } else {
      status = ProposalStatus.DROPPED;
    }

    return {
      ...proposal,
      cycle,
      status,
    };
  });
};

export const getDAOTokenHolders = async (
  contractAddress: string,
  network: Network
): Promise<Ledger> => {
  const { storage } = await getStorage(contractAddress, network);
  const ledger = await getLedgerAddresses(storage.ledgerMapNumber, network);

  return ledger;
};

export const doDAOPropose = async ({
  contractAddress,
  tezos,
  contractParams: { tokensToFreeze, agoraPostId, transfers },
}: ProposeParams) => {
  const contract = await getContract(tezos, contractAddress);

  const contractMethod = contract.methods.propose(
    tokensToFreeze,
    agoraPostId,
    transfers.map(({ amount, recipient }) => ({
      transfer_type: {
        amount,
        recipient,
      },
    }))
  );

  const result = await contractMethod.send();

  return result;
};

export const doDAOVote = async ({
  contractAddress,
  tezos,
  proposalKey,
  amount,
  support,
}: VoteParams) => {
  const contract = await getContract(tezos, contractAddress);

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

export const getDAO = async (
  address: string,
  tezos: TezosToolkit,
  network: Network
): Promise<DAOItem> => {
  return await getDAOInfoFromContract(address, tezos, network);
};

export const doFlush = async ({
  contractAddress,
  tezos,
  numerOfProposalsToFlush,
}: FlushParams) => {
  console.log(numerOfProposalsToFlush);
  const contract = await getContract(tezos, contractAddress);

  const result = await contract.methods.flush(numerOfProposalsToFlush).send();
  return result;
};

export const deployDAO = async ({
  template,
  params,
  metadata,
  tezos,
}: {
  template: DAOTemplate;
  params: MigrationParams;
  metadata: MetadataDeploymentResult;
  tezos: TezosToolkit;
}) => {
  switch (template) {
    case "treasury":
      const treasuryParams = fromStateToTreasuryStorage(params);
      return await deployTreasuryDAO({
        storage: treasuryParams,
        metadataCarrierDeploymentData: metadata,
        tezos,
      });
    case "registry":
      const registryParams = fromStateToRegistryStorage(params);
      return await deployRegistryDAO({
        storage: registryParams,
        metadataCarrierDeploymentData: metadata,
        tezos,
      });
  }
};
