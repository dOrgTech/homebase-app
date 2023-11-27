/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { Poll } from "models/Polls"
import { useNotification } from "modules/common/hooks/useNotification"
import { isProposalActive } from "services/lite/utils"
import { ProposalStatus } from "../components/ProposalTableRowStatusBadge"
import { EnvKey, getEnv } from "services/config"
import { useQuery } from "react-query"

export const usePolls = (id: any) => {
  const openNotification = useNotification()

  const { data, ...rest } = useQuery(
    ["proposals", id],
    async () => {
      const response = await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/polls/${id}/list`)

      if (!response.ok) {
        const data = await response.json()
        openNotification({
          message: data.message,
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

      // @TODO Add functinolity if needed for card in proposal list
      // communityPolls.forEach(async poll => {
      //   if (poll) {
      //     await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/choices/${poll._id}/votes`).then(async response => {
      //       if (!response.ok) {
      //         return
      //       }
      //       const records: number = await response.json()
      //       poll.votes = records
      //       return
      //     })
      //   }
      // })

      return communityPolls
    },
    {
      refetchInterval: 30000,
      enabled: !!id,
      refetchOnMount: "always"
    }
  )

  return {
    data,
    ...rest
  }
}
