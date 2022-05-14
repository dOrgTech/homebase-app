import { GraphQLClient } from "graphql-request"

if (!process.env.REACT_APP_HASURA_URL) {
  throw new Error("REACT_APP_HASURA_URL is not set")
}

if (!process.env.REACT_APP_HASURA_ADMIN_SECRET) {
  throw new Error("REACT_APP_HASURA_ADMIN_SECRET is not set")
}

const BASE_URL = process.env.REACT_APP_HASURA_URL
const HASURA_ADMIN_SECRET = process.env.REACT_APP_HASURA_ADMIN_SECRET

export const client = new GraphQLClient(BASE_URL, {
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret": HASURA_ADMIN_SECRET
  }
})
