/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { useNotification } from "modules/common/hooks/useNotification"
import { EnvKey, getEnv } from "services/config"

export const useToken = (daoId: string | undefined) => {
  const [tokenAddress, setTokenAddress] = useState<string>("")
  const openNotification = useNotification()

  useEffect(() => {
    async function fetchData() {
      try {
        if (daoId) {
          const communityId = daoId
          await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/token/${communityId}`).then(async response => {
            if (!response.ok) {
              const data = await response.json()
              openNotification({
                message: data.message,
                autoHideDuration: 2000,
                variant: "error"
              })
              return
            }

            const record = await response.json()
            if (!record) {
              return
            }
            setTokenAddress(record.tokenAddress)
          })
        }
      } catch {
        return
      }
    }
    fetchData()

    return
  }, [daoId, setTokenAddress])
  return tokenAddress
}
