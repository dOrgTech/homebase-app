import { useMemo } from "react";
import { useQuery } from "react-query";
import {
  Proposal,
  ProposalStatus,
  ProposalWithStatus,
} from "services/bakingBad/proposals/types";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import dayjs from "dayjs";
import { BaseDAO } from "..";
import { useCycleInfo } from "./useCycleInfo";
import { useDroppedProposalOps } from "./useDroppedProposalOps";

export const useProposals = (
  contractAddress: string | undefined,
  status?: ProposalStatus
) => {
  const { data: dao } = useDAO(contractAddress);
  const { data: droppedProposalsOps } = useDroppedProposalOps(contractAddress);

  const cycleInfo = useCycleInfo(contractAddress);

  const result = useQuery<Proposal[], Error>(
    ["proposals", contractAddress],
    () => (dao as BaseDAO).proposals(),
    {
      enabled: !!dao,
    }
  );

  const filteredData: ProposalWithStatus[] = useMemo(() => {
    if (!result.data || !cycleInfo || !dao || !droppedProposalsOps) {
      return [];
    }

    const proposalsWithStatus = result.data?.map((proposal) => {
      const secondsPassed = cycleInfo.current * dao.storage.votingPeriod;
      const activeThresholdInSeconds =
        (proposal.period + 1) * dao.storage.votingPeriod;
      const passedOrRejectedThresholdInSeconds =
        (proposal.period + 2) * dao.storage.votingPeriod;
      const flushThresholdInSeconds =
        proposal.period * dao.storage.votingPeriod +
        dao.storage.proposalFlushTime;
      const expiredThresholdInSeconds =
        proposal.period * dao.storage.votingPeriod +
        dao.storage.proposalExpiredTime;

      const statusHistory: { status: ProposalStatus; timestamp: string }[] = [];

      const isNotExecutedOrDropped = dao.storage.proposalsToFlush.find(
        (id) => id.toLowerCase() === proposal.id.toLowerCase()
      );

      if (!isNotExecutedOrDropped) {
        const droppedProposalOp = droppedProposalsOps.find(
          (droppedProposal) =>
            droppedProposal.id.toLowerCase() === proposal.id.toLowerCase()
        );

        if (!!droppedProposalOp) {
          statusHistory.push({
            status: ProposalStatus.DROPPED,
            timestamp: dayjs(droppedProposalOp.timestamp).format("LLL"),
          });
  
          return {
            ...proposal,
            status: ProposalStatus.DROPPED,
            flushable: false,
            statusHistory,
          };
        }

        statusHistory.push({
          status: ProposalStatus.EXECUTED,
          timestamp: dayjs(proposal.startDate).format("LLL"),
        });

        return {
          ...proposal,
          status: ProposalStatus.EXECUTED,
          flushable: false,
          statusHistory,
        };
      }

      statusHistory.push({
        status: ProposalStatus.PENDING,
        timestamp: dayjs(proposal.startDate).format("LLL"),
      });

      if (secondsPassed < activeThresholdInSeconds) {
        return {
          ...proposal,
          status: ProposalStatus.PENDING,
          flushable: false,
          statusHistory,
        };
      }

      statusHistory.push({
        status: ProposalStatus.ACTIVE,
        timestamp: dayjs(dao.storage.start_time)
          .add(activeThresholdInSeconds, "seconds")
          .format("LLL"),
      });

      if (secondsPassed < passedOrRejectedThresholdInSeconds) {
        return {
          ...proposal,
          status: ProposalStatus.ACTIVE,
          flushable: false,
          statusHistory,
        };
      }

      if (proposal.upVotes >= Number(proposal.quorumThreshold)) {
        statusHistory.push({
          status: ProposalStatus.PASSED,
          timestamp: dayjs(dao.storage.start_time)
            .add(flushThresholdInSeconds, "seconds")
            .format("LLL"),
        });
      }

      if (proposal.downVotes >= Number(proposal.quorumThreshold)) {
        statusHistory.push({
          status: ProposalStatus.REJECTED,
          timestamp: dayjs(dao.storage.start_time)
            .add(flushThresholdInSeconds, "seconds")
            .format("LLL"),
        });
      }

      statusHistory.push({
        status: ProposalStatus.NO_QUORUM,
        timestamp: dayjs(dao.storage.start_time)
          .add(flushThresholdInSeconds, "seconds")
          .format("LLL"),
      });

      if (secondsPassed < expiredThresholdInSeconds) {
        let status = ProposalStatus.NO_QUORUM;
        let flushable = true;

        if (proposal.upVotes >= Number(proposal.quorumThreshold)) {
          status = ProposalStatus.PASSED;
        }

        if (proposal.downVotes >= Number(proposal.quorumThreshold)) {
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

      statusHistory.push({
        status: ProposalStatus.EXPIRED,
        timestamp: dayjs(dao.storage.start_time)
          .add(expiredThresholdInSeconds, "seconds")
          .format("LLL"),
      });

      return {
        ...proposal,
        status: ProposalStatus.EXPIRED,
        flushable: false,
        statusHistory,
      };
    });

    console.log(proposalsWithStatus);

    if (!status) {
      return proposalsWithStatus;
    }

    return proposalsWithStatus.filter(
      (proposalData) => proposalData.status === status
    );
  }, [result.data, cycleInfo, dao, droppedProposalsOps, status]);

  return {
    ...result,
    data: filteredData,
  };
};
