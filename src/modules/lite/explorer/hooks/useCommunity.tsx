/* eslint-disable react-hooks/exhaustive-deps */
import { Community } from "models/Community"
import { useNotification } from "modules/common/hooks/useNotification"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export const useCommunity = (daoId: string, isUpdated?: number) => {
  const [community, setCommunity] = useState<Community>()
  const openNotification = useNotification()

  useEffect(() => {
    async function fetchData() {
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/daos/${daoId.toString()}`).then(async response => {
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
