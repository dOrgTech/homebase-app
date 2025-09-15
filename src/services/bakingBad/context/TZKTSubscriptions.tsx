import React, { createContext, useEffect, useRef, useState } from "react"
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr"
import { Network } from "services/beacon"
import { useTezos } from "services/beacon/hooks/useTezos"
import { networkNameMap } from "../index"

interface State {
  block: number
}

const TZKTSubscriptionsContext = createContext<{
  state: State
}>({
  state: {
    block: 0
  }
})

interface BlockMessage {
  type: number
  state: number
}

const getUrl = (network: Network) => `https://api.${networkNameMap[network]}.tzkt.io/v1/ws`

const TZKTSubscriptionsProvider: React.FC = ({ children }) => {
  const [block, setBlock] = useState<number>(0)
  const socketRef = useRef<HubConnection>()
  const { network } = useTezos()

  useEffect(() => {
    if (network.startsWith("etherlink")) return
    ;(async () => {
      socketRef.current = new HubConnectionBuilder().withUrl(getUrl(network)).withAutomaticReconnect().build()

      try {
        await socketRef.current.start()
      } catch (e) {
        console.warn("TZKT SignalR start failed", e)
        return
      }

      socketRef.current.on("blocks", (blockMessage: BlockMessage) => {
        setBlock(blockMessage.state)
      })

      try {
        await socketRef.current.invoke("SubscribeToBlocks")
      } catch (e) {
        console.warn("TZKT SignalR subscribe failed", e)
      }
    })()

    return () => {
      socketRef.current?.stop()
    }
  }, [network])

  return <TZKTSubscriptionsContext.Provider value={{ state: { block } }}>{children}</TZKTSubscriptionsContext.Provider>
}

export { TZKTSubscriptionsProvider, TZKTSubscriptionsContext }
