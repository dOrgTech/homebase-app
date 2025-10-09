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
        // Keep only fungible tokens (ERC‑20). Blockscout exposes token.token.type
        const mapped = (data || [])
          .map((token: any) => {
            const type = String(token?.token?.type || "").toUpperCase()
            const address = token?.token?.address || token?.token?.contract_address || token?.token?.address_hash || ""
            return {
              address,
              balance: ethers.formatUnits(token?.value, Number(token?.token?.decimals || 0)),
              decimals: Number(token?.token?.decimals || 0),
              symbol: token?.token?.symbol || "Unknown",
              name: token?.token?.name || "Unknown",
              type
            }
          })
          // Filter out NFTs/collectibles shown separately under daoNfts
          .filter((t: any) => {
            const ty = t?.type || ""
            if (!ty) return true // be permissive if type missing
            // Accept ERC20 only
            return ty.includes("ERC20") || ty.includes("ERC-20")
          })
          // Ensure we only include tokens with a valid contract address
          .filter((t: any) => typeof t?.address === "string" && ethers.isAddress(t.address))

        setDaoTreasuryTokens(mapped)
      }),
      getEtherlinkDAONfts(network, registryAddress).then(data => {
        setDaoNfts(data?.items)
      })
    ])
  }, [network, registryAddress])

  return { daoRegistryDetails, daoTreasuryTokens, daoNfts }
}
