import { Network } from "services/beacon"
import { networkNameMap } from ".."
import { DelegationDTO, TokenDelegationDTO } from "./types"
import BigNumber from "bignumber.js"
import { getCurrentBlock } from "services/utils/utils"
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
  console.log("urlssdasd: ", url)
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

export const getTokenVoteWeight = async (tokenAddress: string, account: string, network: Network) => {
  const level = await getCurrentBlock(network)

  const url = `${getEnv(
    EnvKey.REACT_APP_LITE_API_URL
  )}/network/${network}/token/${tokenAddress}/token-id/0/voting-power?userAddress=${account}&level=${level}`
  const response = await fetch(url)
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message)
  }

  const result: { votingWeight: string } = await response.json()
  if (result) {
    return new BigNumber(result.votingWeight)
  }

  return new BigNumber(0)
}
