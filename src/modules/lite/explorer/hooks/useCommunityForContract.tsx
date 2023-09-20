/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { Community } from "models/Community"
import { useNotification } from "modules/common/hooks/useNotification"
import { useTezos } from "services/beacon/hooks/useTezos"

export const useCommunityForContract = (daoContract: string) => {
  const [community, setCommunity] = useState<Community>()
  const openNotification = useNotification()
  const { network } = useTezos()

  useEffect(() => {
    return
  }, [daoContract, setCommunity])
  return community
}
