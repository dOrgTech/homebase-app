import React from "react"
import { Avatar, styled } from "@material-ui/core"
import { Blockie } from "modules/common/Blockie"
import { useProfileClaim } from "services/tzprofiles/hooks/useProfileClaim"

const StyledAvatar = styled(Avatar)(({ size }: { size?: number }) => ({
  width: size || 40,
  height: size || 40
}))

export const ProfileAvatar: React.FC<{ address: string; size?: number }> = ({ address, size }) => {
  const { data: profile } = useProfileClaim(address)

  return (
    <>
      {profile ? (
        <StyledAvatar alt={profile.credentialSubject.alias} src={profile.credentialSubject.logo} size={size} />
      ) : (
        <Blockie address={address} size={size} />
      )}
    </>
  )
}
