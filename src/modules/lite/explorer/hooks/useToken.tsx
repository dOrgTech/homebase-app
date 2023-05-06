/* eslint-disable react-hooks/exhaustive-deps */
import { Community } from "models/Community"
import { useNotification } from "modules/common/hooks/useNotification"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { EnvKey, getEnv } from "services/config"

export const useToken = (daoId: string) => {
  const [tokenAddress, setTokenAddress] = useState<string>("")
  const openNotification = useNotification()

  useEffect(() => {
    async function fetchData() {
      try {
        const communityId = daoId
        await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/token/${communityId}`).then(async response => {
          if (!response.ok) {
            openNotification({
              message: "An error has occurred",
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
      } catch {
        return
      }
    }
    fetchData()

    return
  }, [daoId, setTokenAddress])
  return tokenAddress
}
