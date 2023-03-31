/* eslint-disable react-hooks/exhaustive-deps */
import { Choice } from "models/Choice"
import { Poll } from "models/Polls"
import { useNotification } from "modules/common/hooks/useNotification"
import React, { useEffect, useState } from "react"

export const usePollChoices = (poll: Poll | undefined, refresh?: number) => {
  const [choices, setChoices] = useState<Choice[]>([])
  const openNotification = useNotification()

  useEffect(() => {
    async function fetchChoices() {
      if (poll) {
        await fetch(`${process.env.REACT_APP_API_URL}/choices/${poll._id}/find`).then(async response => {
          if (!response.ok) {
            openNotification({
              message: "An error has occurred",
              autoHideDuration: 2000,
              variant: "error"
            })
            return
          }
          const records: Choice[] = await response.json()
          setChoices(records)
          return
        })
      }
    }
    fetchChoices()
    return
  }, [poll, refresh])
  return choices
}
