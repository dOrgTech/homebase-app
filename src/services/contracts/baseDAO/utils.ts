import { TezosToolkit } from "@taquito/taquito";
import { tzip16 } from "@taquito/tzip16";
import { BigNumber } from "bignumber.js";
import dayjs from "dayjs";
import { MigrationParams } from "modules/creator/state";
import { CycleType } from ".";
import { BaseStorageParams } from "./types";
import { unpackDataBytes } from "@taquito/michel-codec";
import isBetween from "dayjs/plugin/isBetween";

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
