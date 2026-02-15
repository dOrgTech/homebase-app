import { Network } from "services/beacon"
import { networkNameMap } from ".."
import { DelegationDTO, TokenDelegationDTO } from "./types"
import BigNumber from "bignumber.js"
import { EnvKey, getEnv } from "services/config"

export const getLatestDelegation = async (daoAddress: string, network: Network) => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/operations/delegations?sender=${daoAddress}&status=applied`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch delegations from TZKT API")
  }

  const resultingDelegations: DelegationDTO[] = await response.json()

  if (!resultingDelegations.length) {
    return null
  }

  return resultingDelegations[0]
}

export const getTokenDelegation = async (tokenAddress: string, account: string, network: Network) => {
  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/contracts/${tokenAddress}/bigmaps/delegates/keys?key.eq=${account}&active=true`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch token delegations from TZKT API")
  }

  const resultingDelegations: TokenDelegationDTO[] = await response.json()

  if (resultingDelegations.length === 0) {
    return null
  }

  const delegatedTo = resultingDelegations[0].value

  return delegatedTo
}

export const getTokenVoteWeight = async (tokenAddress: string, account: string, network: Network, level: string) => {
  const url = `${getEnv(
    EnvKey.REACT_APP_LITE_API_URL
  )}/network/${network}/token/${tokenAddress}/token-id/0/voting-power?userAddress=${account}&level=${level}`
  const response = await fetch(url)

  let fullTezBalance = new BigNumber(0)
  const fullTezBalanceResp = await fetch(
    `https://tcinfra.net/rpc/tezos/${networkNameMap[network]}/chains/main/blocks/${level}/context/contracts/${account}/full_balance`
  )

  if (fullTezBalanceResp.ok) {
    const balanceStr = await fullTezBalanceResp.json() // e.g., "123456789"
    fullTezBalance = fullTezBalance.plus(new BigNumber(balanceStr ?? 0))
    console.log(fullTezBalance)
  } else {
    const fullTezBalanceRespData = await fullTezBalanceResp.json()
    throw new Error(fullTezBalanceRespData.message)
  }

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message)
  }

  const result: { votingWeight: string; votingXTZWeight: string } = await response.json()

  if (result) {
    return {
      votingWeight: new BigNumber(result.votingWeight),
      votingXTZWeight: fullTezBalance
    }
  }

  return {
    votingWeight: new BigNumber(0),
    votingXTZWeight: new BigNumber(0)
  }
}
