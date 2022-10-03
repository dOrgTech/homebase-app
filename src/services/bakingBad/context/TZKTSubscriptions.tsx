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

const getUrl = (network: Network) => `https://api.${networkNameMap[network]}.tzkt.io/v1/events`

const TZKTSubscriptionsProvider: React.FC = ({ children }) => {
  const [block, setBlock] = useState<number>(0)
  const socketRef = useRef<HubConnection>()
  const { network } = useTezos()

  useEffect(() => {
    ;(async () => {
      socketRef.current = new HubConnectionBuilder().withUrl(getUrl(network)).build()

      await socketRef.current.start()

      // listen for incoming message
      socketRef.current.on("blocks", (blockMessage: BlockMessage) => {
        setBlock(blockMessage.state)
      })

      await socketRef.current.invoke("SubscribeToBlocks")
    })()

    return () => {
      socketRef.current?.stop()
    }
  }, [network])

  return <TZKTSubscriptionsContext.Provider value={{ state: { block } }}>{children}</TZKTSubscriptionsContext.Provider>
}

export { TZKTSubscriptionsProvider, TZKTSubscriptionsContext }
