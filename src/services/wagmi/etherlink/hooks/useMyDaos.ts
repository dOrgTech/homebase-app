import { useEffect, useMemo } from "react"
import useFirestoreStore from "services/contracts/etherlinkDAO/hooks/useFirestoreStore"
import { networkConfig } from "modules/etherlink/utils"

export const useMyDaos = (network: string, address?: string) => {
  const { data: firestoreData, loading: firestoreLoading, fetchDoc } = useFirestoreStore()

  const firebaseMemberCollection = useMemo(() => {
    return networkConfig[network as keyof typeof networkConfig]?.firebaseMemberCollection
  }, [network])

  useEffect(() => {
    if (!firebaseMemberCollection || !address) return
    try {
      fetchDoc(firebaseMemberCollection, address)
      const lower = address.toLowerCase()
      if (lower !== address) fetchDoc(firebaseMemberCollection, lower)
    } catch (_) {
      // noop
    }
  }, [firebaseMemberCollection, address, fetchDoc])

  const memberDocKey = useMemo(() => {
    return firebaseMemberCollection && address ? `${firebaseMemberCollection}/${address}` : ""
  }, [firebaseMemberCollection, address])

  const memberDocKeyLower = useMemo(() => {
    const lower = address?.toLowerCase?.() || ""
    return firebaseMemberCollection && lower ? `${firebaseMemberCollection}/${lower}` : ""
  }, [firebaseMemberCollection, address])

  const myDaoAddresses = useMemo(() => {
    const primary = memberDocKey ? firestoreData?.[memberDocKey] : undefined
    const fallback = memberDocKeyLower ? firestoreData?.[memberDocKeyLower] : undefined
    const record =
      (primary && primary.length > 0 ? primary[0] : undefined) ||
      (fallback && fallback.length > 0 ? fallback[0] : undefined)
    const arr = Array.isArray(record?.daos) ? (record?.daos as string[]) : []
    return arr.map(x => (typeof x === "string" ? x.toLowerCase() : x)).filter(Boolean)
  }, [firestoreData, memberDocKey, memberDocKeyLower])

  const isLoadingMyDaos = useMemo(() => {
    if (!memberDocKey && !memberDocKeyLower) return false
    return Boolean(
      (memberDocKey && firestoreLoading?.[memberDocKey]) || (memberDocKeyLower && firestoreLoading?.[memberDocKeyLower])
    )
  }, [firestoreLoading, memberDocKey, memberDocKeyLower])

  return { myDaoAddresses, isLoadingMyDaos }
}
