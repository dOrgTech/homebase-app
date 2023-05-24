import { BaseDAO } from ".."
import { useQuery } from "react-query"
import { DAOHolding, getDAOBalances, getDAONFTBalances, NFTDAOHolding } from "services/bakingBad/tokenBalances"
import { useDAO } from "services/services/dao/hooks/useDAO"
import { useTezos } from "services/beacon/hooks/useTezos"
import { useMemo } from "react"
import { NFT } from "models/Token"

export const useDAOHoldings = (contractAddress: string) => {
  const { data: dao } = useDAO(contractAddress)
  const { network } = useTezos()

  const { data, ...rest } = useQuery<DAOHolding[], Error>(
    ["balances", contractAddress],
    async () => {
      return await getDAOBalances((dao as BaseDAO).data.address, network)
    },
    {
      enabled: !!dao
    }
  )

  const tokens = useMemo(() => {
    if (!data) {
      return []
    }

    return data.filter(holding => !(holding.token instanceof NFT))
  }, [data])

  return {
    tokenHoldings: tokens,
    data,
    ...rest
  }
}

export const useDAONFTHoldings = (contractAddress: string) => {
  const { data: dao } = useDAO(contractAddress)
  const { network } = useTezos()

  const { data, ...rest } = useQuery<DAOHolding[], Error>(
    ["nftbalances", contractAddress],
    async () => {
      return await getDAONFTBalances((dao as BaseDAO).data.address, network)
    },
    {
      enabled: !!dao
    }
  )

  const nfts = useMemo(() => {
    if (!data) {
      return null
    }

    return data.filter(holding => holding.token instanceof NFT && holding.balance.isGreaterThan(0)) as NFTDAOHolding[]
  }, [data])

  return {
    nftHoldings: nfts,
    data,
    ...rest
  }
}
