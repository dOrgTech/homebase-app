import { EnvKey, getEnv } from "services/config"

const normalize = (value: string) => value.trim().toLowerCase()

const parseEnabledFeatures = (): Set<string> => {
  const raw = getEnv(EnvKey.REACT_APP_ENABLED_FEATURES)
  if (!raw) {
    return new Set()
  }

  return new Set(
    raw
      .split(/[,\s]+/)
      .map(normalize)
      .filter(Boolean)
  )
}

export const isFeatureEnabled = (feature: string): boolean => {
  if (!feature) {
    return false
  }

  return parseEnabledFeatures().has(normalize(feature))
}
