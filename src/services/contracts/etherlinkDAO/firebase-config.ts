import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyBqvj7uTsnxX8B-PNRaNI_bWoUevyx-TII",
  authDomain: "homebase-6907d.firebaseapp.com",
  projectId: "homebase-6907d",
  storageBucket: "homebase-6907d.firebasestorage.app",
  messagingSenderId: "377420069232",
  appId: "1:377420069232:web:4d2b785464d3a0e09077b5",
  measurementId: "G-67HZK5DL97"
}
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
