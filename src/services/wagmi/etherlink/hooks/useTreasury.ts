import { useEffect, useState } from "react"
import { getEtherAddressDetails, getEtherTokenBalances, getEtherlinkDAONfts } from "modules/etherlink/utils"
import { ethers } from "ethers"

export const useTreasury = (network: string, registryAddress?: string) => {
  const [daoRegistryDetails, setDaoRegistryDetails] = useState<{ balance: string }>({ balance: "0" })
  const [daoTreasuryTokens, setDaoTreasuryTokens] = useState<any[]>([])
  const [daoNfts, setDaoNfts] = useState<any[]>([])

  useEffect(() => {
    if (!registryAddress) return
    Promise.all([
      getEtherAddressDetails(network, registryAddress).then(data => {
        const coinBalance = data?.coin_balance
        const ethBalance = ethers.formatEther(coinBalance)
        setDaoRegistryDetails({ balance: ethBalance })
      }),
      getEtherTokenBalances(network, registryAddress).then(data => {
        setDaoTreasuryTokens(
          data?.map((token: any) => ({
            address: token.token.address,
            balance: ethers.formatUnits(token.value, Number(token.token.decimals)),
            decimals: Number(token.token.decimals),
            symbol: token.token?.symbol || "Unknown",
            name: token.token?.name || "Unknown"
          }))
        )
      }),
      getEtherlinkDAONfts(network, registryAddress).then(data => {
        setDaoNfts(data?.items)
      })
    ])
  }, [network, registryAddress])

  return { daoRegistryDetails, daoTreasuryTokens, daoNfts }
}
