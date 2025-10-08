import { createContext, ReactNode, useContext, useState } from "react"

export const NetworkContext = createContext<any | undefined>(undefined)

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<string>(localStorage.getItem("homebase:network") || "tezos")
  return <NetworkContext.Provider value={{ network, setNetwork }}>{children}</NetworkContext.Provider>
}

export const useNetwork = () => {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider")
  }
  return context
}
