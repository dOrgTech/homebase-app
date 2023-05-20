/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { Poll } from "models/Polls"
import { useNotification } from "modules/common/hooks/useNotification"
import { isProposalActive } from "services/lite/utils"
import { ProposalStatus } from "../components/ProposalTableRowStatusBadge"
import { EnvKey, getEnv } from "services/config"

export const usePolls = (pollList: string[] | undefined, id?: any, community?: any) => {
  const [polls, setPolls] = useState<Poll[]>([])
  const openNotification = useNotification()

  useEffect(() => {
    async function fetchPoll() {
      if (pollList && pollList.length > 0) {
        console.log(
          "`${process.env.REACT_APP_LITE_API_URL}/polls/${id}/list`: ",
          `${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/polls/${id}/list`
        )
        await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/polls/${id}/list`).then(async response => {
          if (!response.ok) {
            openNotification({
              message: "An error has occurred",
              autoHideDuration: 2000,
              variant: "error"
            })
            return
          }

          const record: Poll[] = await response.json()
          if (!record) {
            return
          }

          const communityPolls = record.filter(rec => rec.daoID === id)
          communityPolls.map(community => {
            community.timeFormatted = isProposalActive(Number(community.endTime))
            community.isActive = !community.timeFormatted.includes("ago")
              ? ProposalStatus.ACTIVE
              : ProposalStatus.CLOSED
          })

          setPolls(communityPolls)
          return
        })
      }
    }
    fetchPoll()
    return
  }, [id, community])
  return polls
}
