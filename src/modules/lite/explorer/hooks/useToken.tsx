/* eslint-disable react-hooks/exhaustive-deps */
import { Community } from "models/Community"
import { useNotification } from "modules/common/hooks/useNotification"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { EnvKey, getEnv } from "services/config"
import { useDAO } from "services/services/dao/hooks/useDAO"

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
