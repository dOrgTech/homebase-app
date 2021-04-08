import { MichelsonMap, TezosToolkit } from "@taquito/taquito";
import { tzip16 } from "@taquito/tzip16";
import {
  BaseStorageParams,
  MigrationParams,
  TokenHolder,
} from "./types";

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 60 * 60;
const SECONDS_IN_DAY = 60 * 60 * 24;

export const fromStateToBaseStorage = (
  info: MigrationParams
): BaseStorageParams => {
  const membersTokenAllocation = info.memberSettings.tokenHolders.map(
    (holder: TokenHolder) => ({
      address: holder.address,
      amount: holder.balance.toString(),
      tokenId: "0",
    })
  );

  const totalUnfrozenSupply = info.memberSettings.tokenHolders.reduce(
    (prev, holder) => {
      return prev + (holder.balance || 0);
    },
    0
  );

  const totalSupply = new MichelsonMap();
  totalSupply.set(0, totalUnfrozenSupply);
  totalSupply.set(1, 0);

  const storageData = {
    membersTokenAllocation,
    adminAddress: info.memberSettings.administrator || "",

    extra: {
      frozenScaleValue: info.votingSettings.proposeStakePercentage,
      fixedProposalFeeInToken: info.votingSettings.proposeStakeRequired,
      slashScaleValue: info.votingSettings.frozenScaleValue,
      slashDivisionValue: 100,

      minXtzAmount: info.votingSettings.minXtzAmount,
      maxXtzAmount: info.votingSettings.maxXtzAmount || 0,
      maxProposalSize: info.votingSettings.maxProposalSize,
    },
    quorumTreshold: info.votingSettings.quorumTreshold,
    votingPeriod:
      (info.votingSettings.votingHours || 0) * SECONDS_IN_HOUR +
      (info.votingSettings.votingDays || 0) * SECONDS_IN_DAY +
      (info.votingSettings.votingMinutes || 0) * SECONDS_IN_MINUTE,
    totalSupply,
  };

  return storageData;
};

export const getContract = async (
  tezos: TezosToolkit,
  contractAddress: string
) => {
  return await tezos.wallet.at(contractAddress, tzip16);
};
