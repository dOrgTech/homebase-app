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

          // DEBUG: Log raw API response
          console.log("🔍 RAW API RESPONSE for pollId:", pollId)
          console.log("Description length from API:", record.description?.length || 0)
          console.log("Description first 100 chars:", record.description?.substring(0, 100))
          console.log("Has HTML tags:", record.description?.includes("<"))
          console.log("Full record:", JSON.stringify(record, null, 2))

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
    if (pollId) {
      fetchPoll()
    }
    return
  }, [id, community, pollId])
  return poll
}
