import { EnvKey, getEnv } from "services/config"

export const API_URL = `${getEnv(EnvKey.REACT_APP_CORS_PROXY_URL)}/https://forum.tezosagora.org`
