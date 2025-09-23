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
  fetchDoc: (collectionName: string, docId: string) => Promise<void>
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

  // Subscribe to a single document and store it under the key `${collectionName}/${docId}`
  fetchDoc: async (collectionName: string, docId: string) => {
    const { loading } = get()
    const key = `${collectionName}/${docId}`

    if (!collectionName || !docId) return
    if (loading[key]) return

    set(state => ({
      loading: { ...state.loading, [key]: true }
    }))

    try {
      const docRef = doc(db, collectionName, docId)
      const unsubscribe = onSnapshot(
        docRef,
        snapshot => {
          const data = snapshot.data()
          const payload = data ? [{ id: snapshot.id, ...data }] : []
          set(state => ({
            data: { ...state.data, [key]: payload },
            loading: { ...state.loading, [key]: false }
          }))
        },
        error => {
          dbg("[FS:doc:error]", key, error)
          set(state => ({
            error: { ...state.error, [key]: (error as Error).message ?? "Unknown error" },
            loading: { ...state.loading, [key]: false }
          }))
        }
      )

      set(state => ({
        unsubscribe: { ...state.unsubscribe, [key]: unsubscribe }
      }))
    } catch (error) {
      console.log("FirebaseError:fetchDoc", error)
      set(state => ({
        error: { ...state.error, [key]: (error as Error).message ?? "Unknown error" },
        loading: { ...state.loading, [key]: false }
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
