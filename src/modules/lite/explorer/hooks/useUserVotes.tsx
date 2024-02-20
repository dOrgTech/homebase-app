/* eslint-disable react-hooks/exhaustive-deps */
import React from "react"
import { useNotification } from "modules/common/hooks/useNotification"
import { EnvKey, getEnv } from "services/config"
import { useQuery } from "react-query"
import { useTezos } from "services/beacon/hooks/useTezos"
import { Choice } from "models/Choice"

export const useUserVotes = () => {
  const { account } = useTezos()
  const openNotification = useNotification()

  const { data, ...rest } = useQuery(
    ["userVotes"],
    async () => {
      const response = await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/choices/${String(account)}/user_votes`)

      if (!response.ok) {
        const data = await response.json()
        openNotification({
          message: data.message,
          autoHideDuration: 2000,
          variant: "error"
        })
        return
      }

      const userVotedPolls: Choice[] = await response.json()
      if (!userVotedPolls) {
        return
      }
      return userVotedPolls
    },
    {
      refetchInterval: 30000,
      enabled: !!account,
      refetchOnMount: "always"
    }
  )

  return {
    data,
    ...rest
  }
}
