import { NFT } from "models/Token"
import React from "react"
import { useTokenMetadata } from "services/contracts/baseDAO/hooks/useTokenMetadata"

interface Props {
  contractAddress: string
  tokenId: string
}

export const FA2Symbol: React.FC<Props> = ({ contractAddress, tokenId }) => {
  const { data } = useTokenMetadata(contractAddress, tokenId)

  return <>{data && (data instanceof NFT ? `${data.symbol}#${data.token_id}` : data.symbol)}</>
}
