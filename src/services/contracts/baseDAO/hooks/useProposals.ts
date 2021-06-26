import { useMemo } from "react";
import { useQuery } from "react-query";
import {
  ProposalStatus,
  ProposalWithStatus,
} from "services/bakingBad/proposals/types";
import { useDAO } from "services/contracts/baseDAO/hooks/useDAO";
import { BaseDAO, CycleInfo } from "..";
import { useCycleInfo } from "./useCycleInfo";
import { useDroppedProposalOps } from "./useDroppedProposalOps";
import { useTezos } from "services/beacon/hooks/useTezos";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { DroppedProposal, getFlushOperations } from "services/bakingBad/operations";

dayjs.extend(isBetween);

export const useProposals = (
  contractAddress: string | undefined,
  status?: ProposalStatus
) => {
  const { data: dao } = useDAO(contractAddress);
  const { data: droppedProposalsOps } = useDroppedProposalOps(contractAddress);
  const { network } = useTezos();

  const cycleInfo = useCycleInfo(contractAddress);

  const proposalsWithStatus = useQuery<ProposalWithStatus[], Error>(
    ["proposals", contractAddress, status],
    async () => {
      const result = await (dao as BaseDAO).proposals(network);

      return await Promise.all(
        result?.map(async (proposal) => {
          const secondsPassed = (cycleInfo as CycleInfo).current * (dao as BaseDAO).storage.votingPeriod;
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

          const statusHistory: { status: ProposalStatus; timestamp: string }[] =
            [];

          const isInNonFlushedProposalArray = (dao as BaseDAO).storage.proposalsToFlush.find(
            (id) => id.toLowerCase() === proposal.id.toLowerCase()
          );

          const isExecutedDroppedOrExpired = !isInNonFlushedProposalArray;

          if (isExecutedDroppedOrExpired) {
            // Verify if dropped
            const droppedProposalOp = (droppedProposalsOps as DroppedProposal[]).find(
              (droppedProposal) =>
                droppedProposal.id.toLowerCase() === proposal.id.toLowerCase()
            );

            //If proposal id is in dropped proposals array, it is dropped

            if (!!droppedProposalOp) {
              return {
                ...proposal,
                status: ProposalStatus.DROPPED,
                flushable: false,
                statusHistory,
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

            const flushOperations = await getFlushOperations(
              (dao as BaseDAO).address,
              network,
              startOfFlushablePeriod.unix() * 1000,
              endOfFlushablePeriod.unix() * 1000
            );

            const flushOpsInProposalFlushablePeriod = flushOperations.some(
              (op) => {
                const condition = dayjs(op.timestamp).isBetween(
                  startOfFlushablePeriod,
                  endOfFlushablePeriod
                );

                return condition;
              }
            );

            // 2. Verify upvotes meet quorum threshold
            const upvotes = proposal.upVotes;
            const quorumThreshold = proposal.quorumThreshold;
            const isPassed = upvotes.isGreaterThanOrEqualTo(quorumThreshold);

            // If both conditions are true, then it is executed, else it was flushed as an expired proposal

            if (isPassed && flushOpsInProposalFlushablePeriod) {
              return {
                ...proposal,
                status: ProposalStatus.EXECUTED,
                flushable: false,
                statusHistory,
              };
            }

            return {
              ...proposal,
              status: ProposalStatus.EXPIRED,
              flushable: false,
              statusHistory,
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
        })
      );
    },
    {
      enabled: !!cycleInfo && !!dao && !!droppedProposalsOps,
    }
  );

  const filteredData: ProposalWithStatus[] = useMemo(() => {
    if (!proposalsWithStatus.data) {
      return [];
    }

    if (!status) {
      return proposalsWithStatus.data;
    }

    return proposalsWithStatus.data.filter(
      (proposalData) => proposalData.status === status
    );
  }, [proposalsWithStatus, status]);

  return {
    ...proposalsWithStatus,
    data: filteredData,
  };
};
