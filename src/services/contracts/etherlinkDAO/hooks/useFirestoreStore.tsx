// Get Indexes OnChain Data from Firestore
import { create } from "zustand"
import { collection, CollectionReference, doc, DocumentData, getDocs, onSnapshot } from "firebase/firestore"
import { db } from "../firebase-config"
import { dbg } from "utils/debug"

interface FirestoreState {
  data: Record<string, any[]>
  loading: Record<string, boolean>
  error: Record<string, string | null>
  unsubscribe?: Record<string, () => void>
  fetchCollection: (collectionName: string) => Promise<void>
}

const useFirestoreStore = create<FirestoreState>((set, get) => ({
  data: {},
  loading: {},
  error: {},
  unsubscribe: {},

  // Fetch data for a specific collection
  fetchCollection: async (collectionName: string) => {
    console.log("fetchFirebaseCollection", collectionName)
    const { data, loading } = get()

    if (loading[collectionName]) return // Prevent duplicate fetches

    set(state => ({
      loading: { ...state.loading, [collectionName]: true }
    }))

    try {
      // Check if collectionName includes "/" to identify child collections
      if (collectionName.includes("/")) {
        const pathSegments = collectionName.split("/")
        if (pathSegments.length % 2 === 0) {
          throw new Error("Invalid collection path. Ensure the path alternates between document and collection.")
        }
      }

      const collectionRef = collection(db, collectionName)

      const unsubscribe = onSnapshot(
        collectionRef,
        snapshot => {
          dbg("[FS] collection:", collectionName, "count:", snapshot.size)
          try {
            if (snapshot.size > 0) {
              const first = snapshot.docs[0]?.data() as Record<string, unknown>
              if (first) {
                dbg("[FS] sample doc keys:", Object.keys(first))
              }
            }
          } catch (_) {
            // noop
          }

          const collectionData = snapshot.docs.map(doc => ({
            id: doc?.id,
            ...doc?.data()
          }))

          set(state => ({
            data: { ...state.data, [collectionName]: collectionData },
            loading: { ...state.loading, [collectionName]: false }
          }))
        },
        error => {
          dbg("[FS:error]", collectionName, error)
          set(state => ({
            error: { ...state.error, [collectionName]: (error as Error).message ?? "Unknown error" },
            loading: { ...state.loading, [collectionName]: false }
          }))
        }
      )

      // Save unsubscribe function for cleanup
      set(state => ({
        unsubscribe: { ...state.unsubscribe, [collectionName]: unsubscribe }
      }))
    } catch (error) {
      console.log("FirebaseError", error)
      set(state => ({
        error: { ...state.error, [collectionName]: (error as Error).message ?? "Unknown error" },
        loading: { ...state.loading, [collectionName]: false }
      }))
    }
  },

  // Clear data for a specific collection
  clearCollection: (collectionName: string) => {
    const unsubscribe = get().unsubscribe?.[collectionName]
    if (unsubscribe) unsubscribe() // Cleanup Firestore listener

    set(state => ({
      data: { ...state.data, [collectionName]: [] },
      loading: { ...state.loading, [collectionName]: false },
      error: { ...state.error, [collectionName]: null }
    }))
  },

  // Clear all data (useful for logout scenarios)
  clearAll: () => {
    const { unsubscribe } = get()
    Object.values(unsubscribe || {}).forEach(unsub => unsub()) // Cleanup all listeners

    set({
      data: {},
      loading: {},
      error: {},
      unsubscribe: {}
    })
  }
}))

export default useFirestoreStore
