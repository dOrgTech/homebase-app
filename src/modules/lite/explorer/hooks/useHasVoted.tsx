/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { Choice } from "models/Choice"
import { useNotification } from "modules/common/hooks/useNotification"
import { useTezos } from "services/beacon/hooks/useTezos"
import { EnvKey, getEnv } from "services/config"

export const useHasVoted = (refresh?: number) => {
  const [hasVoted, setHasVoted] = useState(false)
  const [vote, setVote] = useState<Choice>()

  const { account } = useTezos()
  const openNotification = useNotification()

  useEffect(() => {
    async function fetchHasVoted() {
      if (account) {
        try {
          await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/choices/${String(account)}/user`).then(
            async response => {
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
                setHasVoted(false)
                return
              }
              if (record === null) {
                setHasVoted(false)
                return
              }
              setVote(record)
              setHasVoted(true)
              return
            }
          )
        } catch (error) {
          console.log("error: ", error)
          openNotification({
            message: "An error has occurred fetching vote status",
            autoHideDuration: 2000,
            variant: "error"
          })
          return
        }
      }
    }
    fetchHasVoted()

    return
  }, [account, refresh])
  return { hasVoted, vote }
}
