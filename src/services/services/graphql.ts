import { GraphQLClient } from "graphql-request"
import { EnvKey, getEnv } from "services/config"

const BASE_URL = getEnv(EnvKey.REACT_APP_HASURA_URL)

// Create a safe GraphQL client that won't throw at import time if envs are missing.
const makeClient = (url?: string, headers?: Record<string, string>) => {
  if (!url) {
    // Don't crash the app if Hasura URLs are not configured.
    console.warn(`${EnvKey.REACT_APP_HASURA_URL} not configured; Hasura client disabled`)
    return {
      request: async () => {
        throw new Error("Hasura GraphQL client not configured")
      }
    } as unknown as GraphQLClient
  }

  return new GraphQLClient(url, {
    headers: headers || { "content-type": "application/json" }
  })
}

export const client = makeClient(BASE_URL, { "content-type": "application/json" })
