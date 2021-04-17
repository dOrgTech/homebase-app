import React from "react"
import { useTokenMetadata } from "services/contracts/baseDAO/hooks/useTokenMetadata"

interface Props {
  contractAddress: string;
}

export const FA2Symbol: React.FC<Props> = ({ contractAddress }) => {

  const { data } = useTokenMetadata(contractAddress);

  return (
    <>
      {data? data.symbol : contractAddress}
    </>
  )
}