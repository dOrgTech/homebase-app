import { GraphQLClient } from "graphql-request"
import { EnvKey, getEnv } from "services/config"

const BASE_URL = getEnv(EnvKey.REACT_APP_HASURA_URL)
const BASE_URL_V2 = getEnv(EnvKey.REACT_APP_HASURA_URL_V2)
const HASURA_ADMIN_SECRET_V2 = getEnv(EnvKey.REACT_APP_HASURA_ADMIN_SECRET_V2)

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

const headersV2: Record<string, string> = {
  "content-type": "application/json"
}

if (HASURA_ADMIN_SECRET_V2) {
  headersV2["x-hasura-admin-secret"] = HASURA_ADMIN_SECRET_V2
}

export const client_v2 = makeClient(BASE_URL_V2, headersV2)
