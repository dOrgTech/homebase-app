/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { Poll } from "models/Polls"
import { useNotification } from "modules/common/hooks/useNotification"
import { isProposalActive } from "services/lite/utils"
import { ProposalStatus } from "../components/ProposalTableRowStatusBadge"
import { EnvKey, getEnv } from "services/config"

export const usePolls = (id: any) => {
  const [polls, setPolls] = useState<Poll[]>([])
  const openNotification = useNotification()

  useEffect(() => {
    async function fetchPoll() {
      await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/polls/${id}/list`).then(async response => {
        if (!response.ok) {
          openNotification({
            message: "An error has occurred",
            autoHideDuration: 2000,
            variant: "error"
          })
          return
        }

        const communityPolls: Poll[] = await response.json()
        if (!communityPolls) {
          return
        }

        communityPolls.map(community => {
          community.timeFormatted = isProposalActive(Number(community.endTime))
          community.isActive = !community.timeFormatted.includes("ago") ? ProposalStatus.ACTIVE : ProposalStatus.CLOSED
        })

        communityPolls.forEach(async poll => {
          if (poll) {
            await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/choices/${poll._id}/votes`).then(async response => {
              if (!response.ok) {
                console.log("error in query")
                return
              }
              const records: number = await response.json()
              poll.votes = records
              return
            })
          }
        })

        setPolls(communityPolls)
        return
      })
    }
    fetchPoll()
    return
  }, [id])
  return polls
}
