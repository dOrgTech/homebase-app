/* eslint-disable react-hooks/exhaustive-deps */
import { Community } from "models/Community"
import { useNotification } from "modules/common/hooks/useNotification"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export const useCommunity = (isUpdated?: number) => {
  const [community, setCommunity] = useState<Community>()
  const openNotification = useNotification()

  const { id } = useParams<{
    id: string
  }>()

  useEffect(() => {
    async function fetchData() {
      const communityId = id.toString()
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/daos/${communityId}`).then(async response => {
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
  }, [id, isUpdated, setCommunity])
  return community
}
