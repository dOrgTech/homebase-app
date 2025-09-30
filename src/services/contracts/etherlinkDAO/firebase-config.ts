import { initializeApp } from "firebase/app"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import { EnvKey, getEnv } from "services/config"

// Default Firebase Database
const firebaseConfig = {
  apiKey: "AIzaSyBqvj7uTsnxX8B-PNRaNI_bWoUevyx-TII",
  authDomain: "homebase-6907d.firebaseapp.com",
  projectId: "homebase-6907d",
  storageBucket: "homebase-6907d.firebasestorage.app",
  messagingSenderId: "377420069232",
  appId: "1:377420069232:web:4d2b785464d3a0e09077b5",
  measurementId: "G-67HZK5DL97"
}

// // Ash Development Database
// const firebaseConfig = {
//   apiKey: "AIzaSyCacHn9QK3ILsPjYZ-W0BhDmwq0E5P2H7M",
//   authDomain: "tezosbase-dev.firebaseapp.com",
//   projectId: "tezosbase-dev",
//   storageBucket: "tezosbase-dev.firebasestorage.app",
//   messagingSenderId: "1092114198027",
//   appId: "1:1092114198027:web:4acf64746e224d11c1610e",
//   measurementId: "G-LRC23T5C2T"
// }
const app = initializeApp(firebaseConfig)

// Create Firestore instance, then (optionally) connect to emulator before exporting
const dbInstance = getFirestore(app)

// Optionally connect to the local Firestore emulator for development
// Enable by setting REACT_APP_FIRESTORE_EMULATOR_ENABLED=true
const emulatorEnabled = (getEnv(EnvKey.REACT_APP_FIRESTORE_EMULATOR_ENABLED) || "").toLowerCase() === "true"
if (emulatorEnabled) {
  const host = getEnv(EnvKey.REACT_APP_FIRESTORE_EMULATOR_HOST) || "127.0.0.1"
  const portStr = getEnv(EnvKey.REACT_APP_FIRESTORE_EMULATOR_PORT) || "8080"
  const port = Number(portStr)
  connectFirestoreEmulator(dbInstance, host, isNaN(port) ? 8080 : port)
  // Helpful debug log in dev console to confirm emulator usage
  // eslint-disable-next-line no-console
  console.info(`Firestore emulator connected at ${host}:${isNaN(port) ? 8080 : port}`)
}

export const db = dbInstance
