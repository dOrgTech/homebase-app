import { useEffect, useState } from "react"
import { useDAO } from "../../../services/services/dao/hooks/useDAO"
import { useDAOID } from "../pages/DAO/router"

export const useTimeLeftInCycle = () => {
  const daoID = useDAOID()
  const { cycleInfo } = useDAO(daoID)

  const [counter, setCounter] = useState<number>(0)
  const [oldCycle, setOldCycle] = useState<number>(0)
  const [time, setTime] = useState({ hours: "-", minutes: "-", days: "-" })

  useEffect(() => {
    if (cycleInfo) {
      const pendingCycles = cycleInfo.blocksLeft
      setCounter(pendingCycles * cycleInfo.timeEstimateForNextBlock)
      if (cycleInfo.blocksLeft !== oldCycle) {
        setOldCycle(cycleInfo.blocksLeft * cycleInfo.timeEstimateForNextBlock)
      }
    }
  }, [cycleInfo, oldCycle])

  useEffect(() => {
    setTime({
      hours: Math.floor((counter % (3600 * 24)) / 3600).toString(),
      minutes: Math.floor((counter % 3600) / 60).toString(),
      days: Math.floor(counter / (3600 * 24)).toString()
    })
  }, [counter])

  return time
}
