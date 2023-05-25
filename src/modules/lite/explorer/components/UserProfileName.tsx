import React from "react"
import { toShortAddress } from "services/contracts/utils"
import { useProfileClaim } from "services/tzprofiles/hooks/useProfileClaim"

export const UserProfileName: React.FC<{ address: string; short?: boolean }> = ({ address, short }) => {
  const { data: profile } = useProfileClaim(address)

  return <>{profile?.credentialSubject.alias || (short ? toShortAddress(address) : address)}</>
}
