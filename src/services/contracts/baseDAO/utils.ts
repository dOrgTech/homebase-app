import { TezosToolkit } from "@taquito/taquito";
import { tzip16 } from "@taquito/tzip16";
import { BigNumber } from "bignumber.js";
import dayjs from "dayjs";
import { MigrationParams } from "modules/creator/state";
import { CycleType, TransferParams } from ".";
import { BaseStorageParams } from "./types";
import { unpackDataBytes } from "@taquito/michel-codec";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export const fromStateToBaseStorage = (info: MigrationParams): BaseStorageParams => {
  return {
    adminAddress: info.orgSettings.administrator || "",
    governanceToken: {
      address: info.orgSettings.governanceToken.address,
      tokenId: info.orgSettings.governanceToken.tokenId,
    },
    guardian: info.orgSettings.guardian,
    extra: {
      frozenExtraValue: new BigNumber(info.votingSettings.proposeStakeRequired),
      slashScaleValue: new BigNumber(100 - info.votingSettings.returnedTokenPercentage),
      minXtzAmount: new BigNumber(info.votingSettings.minXtzAmount),
      maxXtzAmount: new BigNumber(info.votingSettings.maxXtzAmount || 0),
    },
    quorumThreshold: new BigNumber(info.quorumSettings.quorumThreshold),
    votingPeriod: info.votingSettings.votingBlocks || 0,
    minQuorumAmount: new BigNumber(info.quorumSettings.minQuorumAmount),
    maxQuorumAmount: new BigNumber(info.quorumSettings.maxQuorumAmount),
    quorumChange: info.quorumSettings.quorumChange,
    quorumMaxChange: info.quorumSettings.quorumMaxChange,

    proposalFlushPeriod: info.votingSettings.proposalFlushBlocks || 0,
    proposalExpiryPeriod: info.votingSettings.proposalExpiryBlocks || 0,
  };
};

export const getContract = async (tezos: TezosToolkit, contractAddress: string) => {
  return await tezos.wallet.at(contractAddress, tzip16);
};

export const calculateCycleInfo = (originationTime: string, votingPeriod: number) => {
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

const MAX_ITEMS_IN_PROPOSAL = 15;

export const splitTransferParams = (transfers: TransferParams[]): TransferParams[][] => {
  const groups = transfers
    .map((_item: TransferParams, index: number) => {
      return index % MAX_ITEMS_IN_PROPOSAL === 0 ? transfers.slice(index, index + MAX_ITEMS_IN_PROPOSAL) : null;
    })
    .filter((item) => {
      return item;
    });
  return groups as TransferParams[][];
};
