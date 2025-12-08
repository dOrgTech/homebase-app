import { useEffect, useMemo, useState } from "react"
import useFirestoreStore from "services/contracts/etherlinkDAO/hooks/useFirestoreStore"
import { networkConfig } from "modules/etherlink/utils"
import { sanitizeDaoName, sanitizeDaoDescription, sanitizeDaoSymbol } from "utils/sanitize"

export type DaoListItem = {
  id: string
  address: string
  name: string
  description?: string
  token: string
  registryAddress: string
  decimals: number
  symbol: string
}

export const useDaoList = (network: string) => {
  const firebaseRootCollection = useMemo(() => {
    return networkConfig[network as keyof typeof networkConfig]?.firebaseRootCollection
  }, [network])

  const { data: firestoreData, fetchCollection } = useFirestoreStore()
  const [isLoading, setIsLoading] = useState(!!firebaseRootCollection)
  const [daos, setDaos] = useState<DaoListItem[]>([])

  useEffect(() => {
    if (!firebaseRootCollection) return
    fetchCollection(firebaseRootCollection)
  }, [fetchCollection, firebaseRootCollection])

  useEffect(() => {
    if (!firebaseRootCollection) return
    const collection = firestoreData?.[firebaseRootCollection]
    if (Array.isArray(collection)) {
      const sanitizedDaos = collection.map((dao: any) => ({
        ...dao,
        name: sanitizeDaoName(dao.name),
        description: sanitizeDaoDescription(dao.description),
        symbol: sanitizeDaoSymbol(dao.symbol)
      }))
      setDaos(sanitizedDaos)
      setIsLoading(false)
    }
  }, [firestoreData, firebaseRootCollection])

  return { daos, isLoading }
}
