/* eslint-disable react-hooks/exhaustive-deps */
import { Choice } from "models/Choice"
import { useNotification } from "modules/common/hooks/useNotification"
import React, { useEffect, useState } from "react"
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
                openNotification({
                  message: "An error has occurred",
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
        } catch {
          openNotification({
            message: "An error has occurred",
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
