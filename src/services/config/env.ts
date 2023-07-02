import { EnvKey } from "./constants"
require("dotenv").config()

export const getEnv = (envKey: EnvKey): string => {
  return process.env[envKey] ?? ""
}
