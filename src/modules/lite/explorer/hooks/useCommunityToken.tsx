import React, { useEffect, useState } from "react"
import { CommunityToken } from "models/Community"
import { EnvKey, getEnv } from "services/config"

export const useCommunityToken = (communityId: any) => {
  const [token, setToken] = useState<CommunityToken>()
  useEffect(() => {
    async function fetchToken() {
      try {
        if (communityId !== undefined) {
          await fetch(`${getEnv(EnvKey.REACT_APP_LITE_API_URL)}/token/${String(communityId)}`).then(async response => {
            if (!response.ok) {
              const data = await response.json()
              const message = data.message
              return message
            }

            const record: CommunityToken = await response.json()
            if (!record) {
              return
            }

            setToken(record)
            return
          })
        }
      } catch (error) {
        console.log("error: ", error)
        return
      }
    }
    fetchToken()
    return
  }, [communityId])
  return token
}
