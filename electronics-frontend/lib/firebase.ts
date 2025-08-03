// lib/firebase.ts - Replace your current file
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAmu-cUiCYqeGRfBJEBtTPNgmsb7fxQIMQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "login-4a85c.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "login-4a85c",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "login-4a85c.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "429986917707",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:429986917707:web:f34f6de6f1b91ec8828cce",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()

// Configure Google provider
provider.addScope("email")
provider.addScope("profile")