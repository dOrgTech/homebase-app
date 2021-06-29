import { TezosToolkit } from "@taquito/taquito";
import { tzip16 } from "@taquito/tzip16";
import { BigNumber } from "bignumber.js";
import dayjs from "dayjs";
import { MigrationParams } from "modules/creator/state";
import { BaseDAO, CycleInfo, CycleType } from ".";
import { BaseStorageParams } from "./types";
import { unpackDataBytes } from "@taquito/michel-codec";
import isBetween from "dayjs/plugin/isBetween";
import { DroppedProposalOp } from "services/bakingBad/operations";
import { OperationTimestampDTO } from "services/bakingBad/operations/types";
import { Proposal, ProposalStatus } from "services/bakingBad/proposals/types";

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 60 * 60;
const SECONDS_IN_DAY = 60 * 60 * 24;

dayjs.extend(isBetween);

export const fromStateToBaseStorage = (
  info: MigrationParams
): BaseStorageParams => {
  const storageData = {
    adminAddress: info.orgSettings.administrator || "",
    governanceToken: {
      address: info.orgSettings.governanceToken.address,
      tokenId: info.orgSettings.governanceToken.tokenId,
    },
    guardian: info.orgSettings.guardian,
    extra: {
      frozenScaleValue: new BigNumber(
        info.votingSettings.proposeStakePercentage
      ),
      frozenExtraValue: new BigNumber(info.votingSettings.proposeStakeRequired),
      slashScaleValue: new BigNumber(info.votingSettings.frozenScaleValue),
      slashDivisionValue: new BigNumber(100),

      minXtzAmount: new BigNumber(info.votingSettings.minXtzAmount),
      maxXtzAmount: new BigNumber(info.votingSettings.maxXtzAmount || 0),
    },
    quorumThreshold: new BigNumber(info.quorumSettings.quorumThreshold),
    votingPeriod:
      (info.votingSettings.votingHours || 0) * SECONDS_IN_HOUR +
      (info.votingSettings.votingDays || 0) * SECONDS_IN_DAY +
      (info.votingSettings.votingMinutes || 0) * SECONDS_IN_MINUTE,
    minQuorumAmount: new BigNumber(info.quorumSettings.minQuorumAmount),
    maxQuorumAmount: new BigNumber(info.quorumSettings.maxQuorumAmount),
    quorumChange: info.quorumSettings.quorumChange,
    quorumMaxChange: info.quorumSettings.quorumMaxChange,

    proposalFlushPeriod:
      (info.votingSettings.proposalFlushHours || 0) * SECONDS_IN_HOUR +
      (info.votingSettings.proposalFlushDays || 0) * SECONDS_IN_DAY +
      (info.votingSettings.proposalFlushMinutes || 0) * SECONDS_IN_MINUTE,
    proposalExpiryPeriod:
      (info.votingSettings.proposalExpiryHours || 0) * SECONDS_IN_HOUR +
      (info.votingSettings.proposalExpiryDays || 0) * SECONDS_IN_DAY +
      (info.votingSettings.proposalExpiryMinutes || 0) * SECONDS_IN_MINUTE,
  };

  return storageData;
};

export const getContract = async (
  tezos: TezosToolkit,
  contractAddress: string
) => {
  return await tezos.wallet.at(contractAddress, tzip16);
};

export const calculateCycleInfo = (
  originationTime: string,
  votingPeriod: number
) => {
  const current = dayjs().unix() - dayjs(originationTime).unix();
  const periodLeftPercentage = (current / votingPeriod) % 1;
  const timeLeftPercentage = votingPeriod * periodLeftPercentage;
  const time = votingPeriod - Number(timeLeftPercentage.toFixed());
  const currentPeriodNumber = Math.floor(current / votingPeriod);

  return {
    time: Number(time),
    current: currentPeriodNumber,
    type: currentPeriodNumber % 2 === 0 ? "voting" : ("proposing" as CycleType),
  };
};

export const unpackExtraNumValue = (bytes: string): BigNumber => {
  return new BigNumber((unpackDataBytes({ bytes }) as { int: string }).int);
};

export const addStatusToProposal = ({
  dao,
  cycleInfo,
  proposal,
  dropProposalOps,
  flushOps,
}: {
  dao: BaseDAO;
  cycleInfo: CycleInfo;
  proposal: Proposal;
  dropProposalOps: DroppedProposalOp[];
  flushOps: OperationTimestampDTO[];
}) => {
  const secondsPassed =
    (cycleInfo as CycleInfo).current * (dao as BaseDAO).storage.votingPeriod;
  const activeThresholdInSeconds =
    (proposal.period + 1) * (dao as BaseDAO).storage.votingPeriod;
  const passedOrRejectedThresholdInSeconds =
    (proposal.period + 2) * (dao as BaseDAO).storage.votingPeriod;
  const flushThresholdInSeconds =
    proposal.period * (dao as BaseDAO).storage.votingPeriod +
    (dao as BaseDAO).storage.proposalFlushTime;
  const expiredThresholdInSeconds =
    proposal.period * (dao as BaseDAO).storage.votingPeriod +
    (dao as BaseDAO).storage.proposalExpiredTime;

  const statusHistory: { status: ProposalStatus; timestamp: string }[] = [
    {
      status: ProposalStatus.PENDING,
      timestamp: dayjs(proposal.startDate).format("LLL"),
    },
  ];

  const isInNonFlushedProposalArray = (
    dao as BaseDAO
  ).storage.proposalsToFlush.find(
    (id) => id.toLowerCase() === proposal.id.toLowerCase()
  );

  const isExecutedDroppedOrExpired = !isInNonFlushedProposalArray;

  if (isExecutedDroppedOrExpired) {
    // Verify if dropped
    const droppedProposalOp = dropProposalOps.find(
      (droppedProposal) =>
        droppedProposal.proposalId.toLowerCase() === proposal.id.toLowerCase()
    );

    //If proposal id is in dropped proposals array, it is dropped

    if (!!droppedProposalOp) {
      return {
        ...proposal,
        status: ProposalStatus.DROPPED,
        flushable: false,
        statusHistory: [
          ...statusHistory,
          {
            status: ProposalStatus.DROPPED,
            timestamp: dayjs(droppedProposalOp.timestamp).format("LLL"),
          },
        ],
      };
    }

    // Verify if executed

    // 1. Search if flush was called in proposal's flushable period
    const proposalCreationTimestamp = dayjs(proposal.startDate);
    const startOfFlushablePeriod = proposalCreationTimestamp.add(
      (dao as BaseDAO).storage.proposalFlushTime,
      "seconds"
    );
    const endOfFlushablePeriod = proposalCreationTimestamp.add(
      (dao as BaseDAO).storage.proposalExpiredTime,
      "seconds"
    );

    const flushOpsInProposalFlushablePeriod = flushOps.find((op) => {
      const condition = dayjs(op.timestamp).isBetween(
        startOfFlushablePeriod,
        endOfFlushablePeriod
      );

      return condition;
    });

    // 2. Verify upvotes meet quorum threshold
    const upvotes = proposal.upVotes;
    const quorumThreshold = proposal.quorumThreshold;
    const isPassed = upvotes.isGreaterThanOrEqualTo(quorumThreshold);

    // If both conditions are true, then it is executed, else it was flushed as an expired proposal

    if (isPassed && !!flushOpsInProposalFlushablePeriod) {
      return {
        ...proposal,
        status: ProposalStatus.EXECUTED,
        flushable: false,
        statusHistory: [
          ...statusHistory,
          {
            status: ProposalStatus.EXECUTED,
            timestamp: dayjs(
              flushOpsInProposalFlushablePeriod.timestamp
            ).format("LLL"),
          },
        ],
      };
    }

    return {
      ...proposal,
      status: ProposalStatus.EXPIRED,
      flushable: false,
      statusHistory: [
        ...statusHistory,
        {
          status: ProposalStatus.EXPIRED,
          timestamp: endOfFlushablePeriod.format("LLL"),
        },
      ],
    };
  }

  if (secondsPassed < activeThresholdInSeconds) {
    return {
      ...proposal,
      status: ProposalStatus.PENDING,
      flushable: false,
      statusHistory,
    };
  }

  if (secondsPassed < passedOrRejectedThresholdInSeconds) {
    return {
      ...proposal,
      status: ProposalStatus.ACTIVE,
      flushable: false,
      statusHistory,
    };
  }

  if (secondsPassed < expiredThresholdInSeconds) {
    let status = ProposalStatus.NO_QUORUM;
    let flushable = true;

    if (
      proposal.upVotes.isGreaterThanOrEqualTo(
        new BigNumber(proposal.quorumThreshold)
      )
    ) {
      status = ProposalStatus.PASSED;
    }

    if (
      proposal.downVotes.isGreaterThanOrEqualTo(
        new BigNumber(proposal.quorumThreshold)
      )
    ) {
      status = ProposalStatus.REJECTED;
    }

    if (secondsPassed < flushThresholdInSeconds) {
      flushable = false;
    }

    return {
      ...proposal,
      status,
      flushable,
      statusHistory,
    };
  }

  return {
    ...proposal,
    status: ProposalStatus.EXPIRED,
    flushable: false,
    statusHistory,
  };
};
