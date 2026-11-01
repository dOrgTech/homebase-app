import { initializeApp } from "firebase/app"
import { initializeAppCheck, ReCaptchaEnterpriseProvider, ReCaptchaV3Provider } from "firebase/app-check"
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

// App Check: Firestore requests carry a reCAPTCHA-backed token, so Firestore can refuse scripted
// reads once enforcement is turned on in the console. Off when no site key is set (local dev,
// deploys not configured yet). Set REACT_APP_APP_CHECK_PROVIDER=enterprise for a reCAPTCHA
// Enterprise key (default: v3). REACT_APP_APP_CHECK_DEBUG_TOKEN (a token registered in the
// console, or "true" to have one printed) is honoured on localhost only.
const appCheckSiteKey = getEnv(EnvKey.REACT_APP_APP_CHECK_SITE_KEY)
if (appCheckSiteKey) {
  const debugToken = getEnv(EnvKey.REACT_APP_APP_CHECK_DEBUG_TOKEN)
  if (debugToken && ["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    Object.assign(globalThis, { FIREBASE_APPCHECK_DEBUG_TOKEN: debugToken === "true" ? true : debugToken })
  }
  const enterprise = getEnv(EnvKey.REACT_APP_APP_CHECK_PROVIDER).toLowerCase() === "enterprise"
  initializeAppCheck(app, {
    provider: enterprise ? new ReCaptchaEnterpriseProvider(appCheckSiteKey) : new ReCaptchaV3Provider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true
  })
}

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
