import React, { useEffect, useState } from "react"

export const useIsMembers = (account: string, members: any) => {
  const [isMember, setIsMember] = useState(false)

  useEffect(() => {
    async function isCommunityMember() {
      const member = members?.find((elem: any) => elem === account)
      return member ? setIsMember(true) : setIsMember(false)
    }
    isCommunityMember()
    return
  }, [members, account])
  return isMember
}
