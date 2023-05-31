/* eslint-disable react-hooks/exhaustive-deps */
import { Community } from "models/Community"
import { useNotification } from "modules/common/hooks/useNotification"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useTezos } from "services/beacon/hooks/useTezos"
import { EnvKey, getEnv } from "services/config"

export const useCommunity = (daoId: string, isUpdated?: number) => {
  const [community, setCommunity] = useState<Community>()
  const openNotification = useNotification()
  const { network } = useTezos()

  useEffect(() => {
    async function fetchData() {
      try {
        await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/daos/${daoId.toString()}`).then(async response => {
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
          setCommunity(record)
        })
      } catch {
        return
      }
    }
    fetchData()

    return
  }, [daoId, isUpdated, setCommunity])
  return community
}
