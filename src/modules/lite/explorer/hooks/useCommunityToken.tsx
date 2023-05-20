import React, { useEffect, useState } from "react"
import { CommunityToken } from "models/Community"
import { EnvKey, getEnv } from "services/config"

export const useCommunityToken = (communityId: any) => {
  const [token, setToken] = useState<CommunityToken>()
  useEffect(() => {
    async function fetchToken() {
      if (communityId !== undefined) {
        await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/token/${String(communityId)}`).then(async response => {
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
