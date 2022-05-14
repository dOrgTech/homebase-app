import { Network } from "services/beacon"
import { API_URL } from ".."
import { Claim, ClaimsDTO } from "./types"

export const getProfileClaim = async (tzAddress: string, network: Network): Promise<Claim> => {
  const url = `${API_URL}/${tzAddress}/${network}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch Profile Claim from TZProfile API")
  }

  const result: ClaimsDTO = await response.json()
  const profileClaim = result
    .map(claimArray => JSON.parse(claimArray[1]) as Claim)
    .find(claim => claim.type.includes("BasicProfile"))

  if (!profileClaim) {
    throw new Error(`Address ${tzAddress} has no profile in network ${network}`)
  }

  return profileClaim
}
