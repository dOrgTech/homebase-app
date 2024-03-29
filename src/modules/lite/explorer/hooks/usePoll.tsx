/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { Poll } from "models/Polls"
import { useNotification } from "modules/common/hooks/useNotification"
import { isProposalActive } from "services/lite/utils"
import { ProposalStatus } from "../components/ProposalTableRowStatusBadge"
import { EnvKey, getEnv } from "services/config"

export const useSinglePoll = (pollId: string | undefined, id?: any, community?: any) => {
  const [poll, setPoll] = useState<Poll>()
  const openNotification = useNotification()

  useEffect(() => {
    async function fetchPoll() {
      try {
        await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/polls/${pollId}/polls`).then(async response => {
          if (!response.ok) {
            const data = await response.json()
            openNotification({
              message: data.message,
              autoHideDuration: 2000,
              variant: "error"
            })
            return
          }

          const record: Poll = await response.json()
          if (!record) {
            return
          }

          record.timeFormatted = isProposalActive(Number(record.endTime))
          record.isActive =
            record.timeFormatted && !record.timeFormatted.includes("ago")
              ? ProposalStatus.ACTIVE
              : ProposalStatus.CLOSED
          setPoll(record)
          return
        })
      } catch (error) {
        console.log("error: ", error)
        openNotification({
          message: "An error has occurred fetching poll",
          autoHideDuration: 2000,
          variant: "error"
        })
        return
      }
    }
    fetchPoll()
    return
  }, [id, community])
  return poll
}
