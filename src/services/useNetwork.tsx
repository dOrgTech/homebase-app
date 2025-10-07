import { createContext, ReactNode, useContext, useState } from "react"
import { getTezosNetwork } from "services/beacon"

export const NetworkContext = createContext<any | undefined>(undefined)

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<string>(
    localStorage.getItem("homebase:network") || (getTezosNetwork() as string)
  )
  return <NetworkContext.Provider value={{ network, setNetwork }}>{children}</NetworkContext.Provider>
}

export const useNetwork = () => {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider")
  }
  return context
}
