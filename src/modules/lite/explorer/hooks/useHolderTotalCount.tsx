/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { Poll } from "models/Polls"
import { useNotification } from "modules/common/hooks/useNotification"
import { isProposalActive } from "services/lite/utils"
import { ProposalStatus } from "../components/ProposalTableRowStatusBadge"
import { EnvKey, getEnv } from "services/config"
import { Network } from "services/beacon"
import { networkNameMap } from "services/bakingBad"

export const useHoldersTotalCount = (network: Network, tokenAddress: string) => {
  const [count, setCount] = useState<number>(0)
  const openNotification = useNotification()

  useEffect(() => {
    async function fetchTotalCount() {
      try {
        if (tokenAddress !== "") {
          const url = `https://api.${networkNameMap[network]}.tzkt.io/v1/tokens/balances/?token.contract=${tokenAddress}`
          await fetch(url).then(async response => {
            if (!response.ok) {
              openNotification({
                message: "An error has occurred",
                autoHideDuration: 2000,
                variant: "error"
              })
              return
            }

            const record: any[] = await response.json()

            const nonZeroBalance = record.filter((item: any) => item.balance !== "0")
            console.log(record)
            if (!record) {
              return
            }

            setCount(nonZeroBalance.length)
            return
          })
        }
        return
      } catch (error) {
        openNotification({
          message: "An error has occurred",
          autoHideDuration: 2000,
          variant: "error"
        })
        return
      }
    }
    fetchTotalCount()
    return
  }, [network, tokenAddress])
  return count
}
