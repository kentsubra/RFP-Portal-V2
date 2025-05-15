import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Client-side Firebase
import { initializeApp as initializeClientApp } from 'firebase/app';
import { getAuth as getClientAuth } from 'firebase/auth';
import { getFirestore as getClientFirestore } from 'firebase/firestore';

// Server-side Firebase Admin initialization
const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Client-side Firebase config
const firebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase Admin
export function getAdminApp() {
  if (getApps().length === 0) {
    return initializeApp({
      credential: cert(firebaseAdminConfig),
    });
  }
  return getApps()[0];
}

// Initialize client-side Firebase
export function getClientApp() {
  return initializeClientApp(firebaseClientConfig);
}

// Firestore
export const db = getFirestore(getAdminApp());
export const clientDb = getClientFirestore(getClientApp());

// Auth
export const auth = getAuth(getAdminApp());
export const clientAuth = getClientAuth(getClientApp()); 