import { Network } from "services/beacon"
import { networkNameMap } from ".."
import { DelegationDTO, TokenDelegationDTO, UserDelegateBalance } from "./types"
import { getUserTokenBalance } from "../tokenBalances"
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

export const getUserDAODepositBalance = async (account: string, network: Network, daoAddress: string) => {
  const url = `https://api.${network}.tzkt.io/v1/contracts/${daoAddress}/bigmaps/freeze_history/keys?key.eq=${account}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch token delegations from TZKT API")
  }

  const userStakedBalances = await response.json()

  let userDAODepositBalance = new BigNumber(0)

  if (userStakedBalances && userStakedBalances[0]) {
    const userStakedBalance = new BigNumber(userStakedBalances[0].value.staked)
    const userCurrentUnstakedBalance = new BigNumber(userStakedBalances[0].value.current_unstaked)
    const userPastUnstakedBalance = new BigNumber(userStakedBalances[0].value.past_unstaked)

    userDAODepositBalance = userStakedBalance.plus(userCurrentUnstakedBalance).plus(userPastUnstakedBalance)
  }

  return userDAODepositBalance.toString()
}

export const getTokenDelegationVoteWeight = async (
  tokenAddress: string,
  account: string,
  network: Network,
  daoContract?: string
) => {
  const tokenDelegationStatus = await getTokenDelegation(tokenAddress, account, network)
  console.log("tokenDelegationStatus: ", tokenDelegationStatus)
  if (tokenDelegationStatus && tokenDelegationStatus !== account) {
    return []
  } else {
    const selfBalance = await getUserTokenBalance(account, network, tokenAddress)
    if (!selfBalance) {
      throw new Error("Could not fetch delegate token balance from the TZKT API")
    }
    console.log("selfBalance: ", selfBalance)

    let selfDAOBalance

    console.log("daoContract: ", daoContract)
    if (daoContract) {
      selfDAOBalance = await getUserDAODepositBalance(account, network, daoContract)
      console.log("selfDAOBalance: ", selfDAOBalance)
      if (!selfDAOBalance) {
        throw new Error("Could not fetch delegate dao balance from the TZKT API")
      }

      const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/contracts/${tokenAddress}/bigmaps/delegates/keys?value.eq=${account}&active=true`
      console.log("ursssssl: ", url)
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch token delegations from TZKT API")
      }

      const resultingDelegations: TokenDelegationDTO[] = await response.json()

      const delegateBalance: UserDelegateBalance = {
        address: account,
        balance: selfDAOBalance
          ? new BigNumber(selfBalance).plus(new BigNumber(selfDAOBalance)).toString()
          : selfBalance
      }

      if (resultingDelegations.length === 0) {
        return [delegateBalance]
      }

      const delegatedAddressBalances: UserDelegateBalance[] = [delegateBalance]

      await Promise.all(
        resultingDelegations.map(async del => {
          if (del.key === del.value) {
            return
          }
          const balance = await getUserTokenBalance(del.key, network, tokenAddress)
          const userDAOBalance = await getUserDAODepositBalance(del.key, network, daoContract)
          if (balance) {
            delegatedAddressBalances.push({
              address: del.key,
              balance: userDAOBalance ? new BigNumber(userDAOBalance).plus(new BigNumber(balance)).toString() : balance
            })
          }
        })
      )

      console.log("delegatedAddressBalances: ", delegatedAddressBalances)

      return delegatedAddressBalances
    }
  }
}
