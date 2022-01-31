import { TezosToolkit } from "@taquito/taquito";
import { tzip16 } from "@taquito/tzip16";
import { BigNumber } from "bignumber.js";
import dayjs from "dayjs";
import { MigrationParams } from "modules/creator/state";
import { CycleType } from ".";
import { BaseStorageParams } from "./types";
import { unpackDataBytes } from "@taquito/michel-codec";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export const fromStateToBaseStorage = (info: MigrationParams): BaseStorageParams => {
  const votingBlocks = 2 * info.votingSettings.votingBlocks || 0;
  const proposalFlush = votingBlocks + info.votingSettings.proposalFlushBlocks || 0;
  const expiryPeriod = proposalFlush + info.votingSettings.proposalExpiryBlocks || 0;
  const storageData = {
    adminAddress: info.orgSettings.administrator || "",
    governanceToken: {
      address: info.orgSettings.governanceToken.address,
      tokenId: info.orgSettings.governanceToken.tokenId,
    },
    guardian: info.orgSettings.guardian,
    extra: {
      frozenScaleValue: new BigNumber(info.votingSettings.proposeStakePercentage),
      frozenExtraValue: new BigNumber(info.votingSettings.proposeStakeRequired),
      slashScaleValue: new BigNumber(info.votingSettings.frozenScaleValue),
      slashDivisionValue: new BigNumber(100),

      minXtzAmount: new BigNumber(info.votingSettings.minXtzAmount),
      maxXtzAmount: new BigNumber(info.votingSettings.maxXtzAmount || 0),
    },
    quorumThreshold: new BigNumber(info.quorumSettings.quorumThreshold),
    votingPeriod: info.votingSettings.votingBlocks || 0,
    minQuorumAmount: new BigNumber(info.quorumSettings.minQuorumAmount),
    maxQuorumAmount: new BigNumber(info.quorumSettings.maxQuorumAmount),
    quorumChange: info.quorumSettings.quorumChange,
    quorumMaxChange: info.quorumSettings.quorumMaxChange,

    proposalFlushPeriod: proposalFlush,
    proposalExpiryPeriod: expiryPeriod,
  };
  
  return storageData;
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
