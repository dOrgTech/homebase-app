import React, { createContext, useContext, useState, useEffect } from "react"
import { useHistory, useLocation } from "react-router-dom"

const HistoryLengthContext = createContext<number>(0)

export const useHistoryLength = () => useContext(HistoryLengthContext)

export const HistoryLengthProvider: React.FC = ({ children }) => {
  const [historyLength, setHistoryLength] = useState(1)
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    console.log({ history })
    if (history && (history.action === "PUSH" || history.action === "REPLACE")) {
      setHistoryLength(prevLength => prevLength + 1)
    }
  }, [history, location])

  useEffect(() => {
    console.log({ historyLength })
  }, [historyLength])

  return <HistoryLengthContext.Provider value={historyLength}>{children}</HistoryLengthContext.Provider>
}
