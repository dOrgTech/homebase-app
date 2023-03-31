import React, { useEffect, useState } from "react"
import { CommunityToken } from "models/Community"

export const useCommunityToken = (communityId: any) => {
  const [token, setToken] = useState<CommunityToken>()
  useEffect(() => {
    async function fetchToken() {
      if (communityId !== undefined) {
        await fetch(`${process.env.REACT_APP_API_URL}/token/${String(communityId)}`).then(async response => {
          if (!response.ok) {
            const message = `An error has occurred: ${response.statusText}`
            return
          }

          const record: CommunityToken = await response.json()
          if (!record) {
            return
          }

          setToken(record)
          return
        })
      }
    }
    fetchToken()
    return
  }, [communityId])
  return token
}
