import React, { useContext } from "react"
import { EthCreatorContext } from "./state"

export const EthDAOCreate: React.FC = () => {
  const creator = useContext(EthCreatorContext)
  return <div>Ethereum DAO Create</div>
}
