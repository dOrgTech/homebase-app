import { useQuery } from "react-query"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getProfileClaim } from "../claims"
import { Claim } from "../claims/types"

export const useProfileClaim = (tzAddress: string) => {
  const { network } = useTezos()

  const result = useQuery<Claim, Error>(
    ["tzProfile_profile_claim", tzAddress, network],
    () => getProfileClaim(tzAddress, network),
    {
      enabled: !!network && !!tzAddress,
      cacheTime: Infinity,
      refetchOnWindowFocus: false
    }
  )

  return result
}
