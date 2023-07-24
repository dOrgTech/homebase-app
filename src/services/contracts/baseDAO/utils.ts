import { TezosToolkit } from "@taquito/taquito"
import { tzip16 } from "@taquito/tzip16"
import { BigNumber } from "bignumber.js"
import dayjs from "dayjs"
import { MigrationParams } from "modules/creator/state"
import { CycleType } from "."
import { BaseStorageParams } from "./types"
import { unpackDataBytes } from "@taquito/michel-codec"
import isBetween from "dayjs/plugin/isBetween"

dayjs.extend(isBetween)

export const fromStateToBaseStorage = (info: MigrationParams): BaseStorageParams => {
  const proposalFlush = 2 * info.votingSettings.votingBlocks + info.votingSettings.proposalFlushBlocks
  const expiryPeriod = proposalFlush + info.votingSettings.proposalExpiryBlocks

  return {
    adminAddress: info.orgSettings.administrator || "",
    governanceToken: {
      address: info.orgSettings.governanceToken.address,
      tokenId: info.orgSettings.governanceToken.tokenId
    },
    guardian: info.orgSettings.guardian,
    extra: {
      frozenExtraValue: new BigNumber(info.votingSettings.proposeStakeRequired),
      slashScaleValue: new BigNumber(100 - info.votingSettings.returnedTokenPercentage),

      minXtzAmount: new BigNumber(info.votingSettings.minXtzAmount),
      maxXtzAmount: new BigNumber(info.votingSettings.maxXtzAmount || 0)
    },
    quorumThreshold: new BigNumber(info.quorumSettings.quorumThreshold),
    votingPeriod: info.votingSettings.votingBlocks || 0,
    minQuorumAmount: new BigNumber(info.quorumSettings.minQuorumAmount),
    maxQuorumAmount: new BigNumber(info.quorumSettings.maxQuorumAmount),
    quorumChange: info.quorumSettings.quorumChange,
    quorumMaxChange: info.quorumSettings.quorumMaxChange,

    proposalFlushPeriod: proposalFlush,
    proposalExpiryPeriod: expiryPeriod
  }
}

export const getContract = async (tezos: TezosToolkit, contractAddress: string) => {
  return await tezos.wallet.at(contractAddress, tzip16)
}

export const calculateCycleInfo = (originationTime: string, votingPeriod: number) => {
  const current = dayjs().unix() - dayjs(originationTime).unix()
  const periodLeftPercentage = (current / votingPeriod) % 1
  const timeLeftPercentage = votingPeriod * periodLeftPercentage
  const time = votingPeriod - Number(timeLeftPercentage.toFixed())
  const currentPeriodNumber = Math.floor(current / votingPeriod)

  return {
    time: Number(time),
    current: currentPeriodNumber,
    type: currentPeriodNumber % 2 === 0 ? "voting" : ("proposing" as CycleType)
  }
}

export const unpackExtraNumValue = (bytes: string): BigNumber => {
  return new BigNumber((unpackDataBytes({ bytes }) as { int: string }).int)
}

export const replacer = (name: any, val: any) => {
  // convert Number to string
  if (val && val.constructor === BigNumber) {
    return val.toString()
  } else {
    return val // return as is
  }
}
