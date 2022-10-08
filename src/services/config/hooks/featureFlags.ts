import { useFlags } from "launchdarkly-react-client-sdk"
import { FeatureFlag } from "services/config/constants"

export const useFeatureFlag = (featureFlag: FeatureFlag) => {
  const flags = useFlags()
  return flags[featureFlag] ?? false
}
