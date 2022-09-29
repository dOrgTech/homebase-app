import { GraphQLClient } from "graphql-request";
import { EnvKey, getEnv } from 'services/config';


const BASE_URL = getEnv(EnvKey.REACT_APP_HASURA_URL);
const HASURA_ADMIN_SECRET = getEnv(EnvKey.REACT_APP_HASURA_ADMIN_SECRET);

if (!BASE_URL) {
  throw new Error(`${EnvKey.REACT_APP_HASURA_URL} env variable is missing`);
}

if (!HASURA_ADMIN_SECRET) {
  throw new Error(`${EnvKey.REACT_APP_HASURA_ADMIN_SECRET} env variable is missing`);
}

export const client = new GraphQLClient(BASE_URL, {
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
  },
});
