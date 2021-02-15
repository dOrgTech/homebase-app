import { TezosToolkit } from "@taquito/taquito";
import { tzip16 } from "@taquito/tzip16";
import { getLedgerAddresses } from "../../bakingBad/ledger";
import { getStorage } from "../../bakingBad/storage";
import { Network } from "../../beacon/context";
import { getDAOListMetadata } from "./metadataCarrier";
import { DAOItem, ProposeParams, VoteParams } from "./types";
import { getProposals } from "../../bakingBad/proposals";
import {
  ProposalStatus,
  ProposalWithStatus,
} from "../../bakingBad/proposals/types";
import { Ledger } from "../../bakingBad/ledger/types";
import dayjs from "dayjs";
import { getOriginationTime } from "../../bakingBad/operations";
import { RpcClient } from "@taquito/rpc";

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
  const storage = await getStorage(contractAddress, network);
  const metadata = await getDAOListMetadata(contract);
  const ledger = await getLedgerAddresses(storage.ledgerMapNumber, network);
  const originationTime = await getOriginationTime(contractAddress, network);
  const cycle = Math.floor(
    (dayjs().unix() - dayjs(originationTime).unix()) / storage.votingPeriod
  );

  return {
    ...metadata,
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
  const { proposalsMapNumber } = dao;
  const proposals = await getProposals(proposalsMapNumber, network);
  const originationTime = await getOriginationTime(dao.address, network);

  const { votingPeriod, cycle: daoCycle, quorumTreshold } = dao;
  return proposals.map((proposal) => {
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
  const storage = await getStorage(contractAddress, network);
  const ledger = await getLedgerAddresses(storage.proposalsMapNumber, network);

  return ledger;
};

export const doDAOPropose = async ({
  contractAddress,
  tezos,
  contractParams: { tokensToFreeze, agoraPostId, transfers },
}: ProposeParams) => {
  const contract = await getContract(tezos, contractAddress);

  const result = await contract.methods
    .propose(
      tokensToFreeze,
      agoraPostId,
      transfers.map(({ amount, recipient }) => ({
        transfer_type: {
          amount,
          recipient,
        },
      }))
    )
    .send();

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
