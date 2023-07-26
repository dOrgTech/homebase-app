import { Network } from "services/beacon"
import { networkNameMap } from ".."
import { DelegationDTO, TokenDelegationDTO, UserDelegateBalance } from "./types"
import { getUserDAODepositBalance, getUserTokenBalance } from "../tokenBalances"
import BigNumber from "bignumber.js"

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

export const getTokenDelegationVoteWeight = async (
  tokenAddress: string,
  daoAddress: string,
  account: string,
  network: Network
) => {
  const selfBalance = await getUserTokenBalance(account, network, tokenAddress)

  if (!selfBalance) {
    throw new Error("Could not fetch delegate token balance from the TZKT API")
  }

  const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/contracts/${tokenAddress}/bigmaps/delegates/keys?value.eq=${account}&active=true`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch token delegations from TZKT API")
  }

  const resultingDelegations: TokenDelegationDTO[] = await response.json()

  const daoDepositBalance = await getUserDAODepositBalance(account, network, daoAddress)

  const delegateBalance: UserDelegateBalance = {
    address: account,
    balance: daoDepositBalance
      ? new BigNumber(selfBalance).plus(new BigNumber(daoDepositBalance)).toString()
      : selfBalance
  }

  if (resultingDelegations.length === 0) {
    return [delegateBalance]
  }

  const delegatedAddressBalances: UserDelegateBalance[] = []

  await Promise.all(
    resultingDelegations.map(async del => {
      const balance = await getUserTokenBalance(del.key, network, tokenAddress)
      if (balance) {
        delegatedAddressBalances.push({
          address: del.key,
          balance:
            del.key === account && daoDepositBalance
              ? new BigNumber(balance).plus(new BigNumber(daoDepositBalance)).toString()
              : balance
        })
      }
    })
  )
  return delegatedAddressBalances
}
