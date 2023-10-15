/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { useNotification } from "modules/common/hooks/useNotification"
import { Network } from "services/beacon"
import { networkNameMap } from "services/bakingBad"
import { getTokenHoldersCount } from "services/utils/utils"

export const useHoldersTotalCount = (network: Network, tokenAddress: string, tokenID: number) => {
  const [count, setCount] = useState<number>(0)
  const openNotification = useNotification()

  useEffect(() => {
    async function fetchTotalCount() {
      try {
        if (tokenAddress !== "") {
          const holdersCount = await getTokenHoldersCount(network, tokenAddress, tokenID)
          setCount(holdersCount)
        }
      } catch (error) {
        openNotification({
          message: "An error has occurred",
          autoHideDuration: 2000,
          variant: "error"
        })
      }
    }
    fetchTotalCount()
    return
  }, [network, tokenAddress])
  return count
}
