import { useQuery } from "react-query"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getProfileClaim } from "../claims"
import { Claim } from "../claims/types"

export const useProfileClaim = (tzAddress: string) => {
  const { network } = useTezos()

  const isTezosNetwork = !!network && (network.includes("tezos") || network === "mainnet" || network === "ghostnet")
  const isTezosAddress = typeof tzAddress === "string" && tzAddress.startsWith("tz")

  const result = useQuery<Claim, Error>(
    ["tzProfile_profile_claim", tzAddress, network],
    () => getProfileClaim(tzAddress, network),
    {
      enabled: isTezosNetwork && isTezosAddress,
      cacheTime: Infinity,
      refetchOnWindowFocus: false
    }
  )

  return result
}
