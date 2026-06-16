import { useQuery } from "@tanstack/react-query"
import { useTezos } from "services/beacon/hooks/useTezos"
import { getProfileClaim } from "../claims"
import { Claim } from "../claims/types"

export const useProfileClaim = (tzAddress: string) => {
  const { network } = useTezos()

  const isTezosNetwork = !!network && (network.includes("tezos") || network === "mainnet" || network === "shadownet")
  const isTezosAddress = typeof tzAddress === "string" && tzAddress.startsWith("tz")

  const result = useQuery<Claim, Error>({
    queryKey: ["tzProfile_profile_claim", tzAddress, network],
    queryFn: () => getProfileClaim(tzAddress, network),
    enabled: isTezosNetwork && isTezosAddress,
    gcTime: Infinity,
    refetchOnWindowFocus: false
  })

  return result
}
