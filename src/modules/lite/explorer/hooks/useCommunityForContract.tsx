/* eslint-disable react-hooks/exhaustive-deps */
import { Community } from "models/Community"
import { useNotification } from "modules/common/hooks/useNotification"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useTezos } from "services/beacon/hooks/useTezos"
import { EnvKey, getEnv } from "services/config"

export const useCommunityForContract = (daoContract: string) => {
  const [community, setCommunity] = useState<Community>()
  const openNotification = useNotification()
  const { network } = useTezos()

  useEffect(() => {
    return
  }, [daoContract, setCommunity])
  return community
}
