/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { useNotification } from "modules/common/hooks/useNotification"
import { Network } from "services/beacon"
import { networkNameMap } from "services/bakingBad"

export const useIsMember = (network: Network, tokenAddress: string, memberAddress: string) => {
  const [isMember, setIsMember] = useState(false)
  const openNotification = useNotification()

  useEffect(() => {
    async function fetIsMember() {
      try {
        if (tokenAddress !== "" && !network.startsWith("etherlink")) {
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

            const nonZeroBalance = record.filter(
              (item: any) => item.account.address === memberAddress && item.balance !== "0"
            )
            if (!record) {
              return
            }
            nonZeroBalance.length === 0 ? setIsMember(false) : setIsMember(true)
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
    fetIsMember()
    return
  }, [network, tokenAddress, memberAddress])
  return isMember
}
