import { EnvKey } from "./constants"

export const getEnv = (envKey: EnvKey): string => {
  return process.env[envKey] ?? ""
}
