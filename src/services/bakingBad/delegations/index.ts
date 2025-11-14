import BigNumber from "bignumber.js"
import { Network } from "services/beacon"
import { EnvKey, getEnv } from "services/config"
import { networkNameMap } from ".."
import { DelegationDTO, TokenDelegationDTO } from "./types"

const BN = (v: BigNumber.Value) => new BigNumber(v ?? 0)

async function fetchJson<T = unknown>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init)
  if (!res.ok) {
    let body: any
    try {
      body = await res.json()
    } catch {
      body = await res.text()
    }
    const msg = (body && (body.message || body.error)) || res.statusText
    throw new Error(`HTTP ${res.status}: ${msg}`)
  }
  return (await res.json()) as T
}

function tzktBase(network: Network) {
  return `https://api.${networkNameMap[network]}.tzkt.io/v1`
}

export const getLatestDelegation = async (daoAddress: string, network: Network) => {
  // smallest payload: only one most recent, sorted by id desc
  const url = `${tzktBase(network)}/operations/delegations?sender=${daoAddress}&status=applied&limit=1&sort.desc=id`
  const delegations = await fetchJson<DelegationDTO[]>(url)

  if (!delegations.length) return null
  return delegations[0]
}

export const getTokenDelegation = async (tokenAddress: string, account: string, network: Network) => {
  // ask bigmap for a single active key for this account; return just the 'value'
  const url =
    `${tzktBase(network)}/contracts/${tokenAddress}/bigmaps/delegates/keys` +
    `?key.eq=${account}&active=true&limit=1&select=value`

  // TzKT returns an array; with select=value it’s an array of the value type
  const arr = await fetchJson<Array<TokenDelegationDTO["value"]>>(url)
  if (arr.length === 0) return null
  return arr[0]
}

type VotingPowerResponse = { votingWeight: string; votingXTZWeight: string }
type VoteWeight = { votingWeight: BigNumber; votingXTZWeight: BigNumber }

export const getTokenVoteWeight = async (
  tokenAddress: string,
  account: string,
  network: Network,
  level: string
): Promise<VoteWeight> => {
  const votingPowerUrl =
    `${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/network/${network}/token/${tokenAddress}` +
    `/token-id/0/voting-power?userAddress=${account}&level=${level}`

  const voting = await fetchJson<VotingPowerResponse>(votingPowerUrl)

  // 2) Tez full_balance including staked/etc at the given level
  const fullBalanceUrl =
    `https://tcinfra.net/rpc/tezos/${networkNameMap[network]}` +
    `/chains/main/blocks/${level}/context/contracts/${account}/full_balance`

  const balanceStr = await fetchJson<string>(fullBalanceUrl)
  const fullTezBalance = BN(balanceStr)

  return {
    votingWeight: BN(voting.votingWeight),
    votingXTZWeight: fullTezBalance
  }
}
