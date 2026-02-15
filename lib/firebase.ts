'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

function initializeFirebase() {
  // Only initialize in browser environment
  if (typeof window === 'undefined') {
    return;
  }

  // Check if Firebase is already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    // Validate config before initialization
    const requiredFields = [
      'apiKey',
      'authDomain',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId',
    ];

    const missingFields = requiredFields.filter(
      (field) => !firebaseConfig[field as keyof typeof firebaseConfig]
    );

    if (missingFields.length > 0) {
      console.warn(
        `Firebase config missing: ${missingFields.join(', ')}. ` +
        'Please check your environment variables. ' +
        'See SETUP_FIREBASE.md for configuration instructions.'
      );
      return;
    }

    app = initializeApp(firebaseConfig);
  }

  // Initialize Auth and Firestore
  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
  }
}

// Initialize Firebase on module load
if (typeof window !== 'undefined') {
  initializeFirebase();
}

export { app, auth, db };
export default app;
