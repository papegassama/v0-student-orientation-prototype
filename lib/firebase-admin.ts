import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { Auth, getAuth as getAdminAuth } from 'firebase-admin/auth';
import { Firestore, getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

let adminApp: App | undefined;
let adminAuth: Auth | undefined;
let adminDb: Firestore | undefined;

// Initialize Firebase Admin SDK only once and handle missing credentials gracefully
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    adminApp = getApps()[0];
    adminAuth = getAdminAuth(adminApp);
    adminDb = getAdminFirestore(adminApp);
    return;
  }

  try {
    const serviceAccountKey = process.env.FIREBASE_ADMIN_SDK_KEY;

    if (!serviceAccountKey) {
      // During build time, this is expected to be missing
      console.warn('Firebase Admin SDK key not available - this is expected during build time');
      return;
    }

    const serviceAccount = JSON.parse(serviceAccountKey);

    if (!serviceAccount.project_id) {
      console.error('Service account missing project_id');
      return;
    }

    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    adminAuth = getAdminAuth(adminApp);
    adminDb = getAdminFirestore(adminApp);
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    // Don't throw - allow build to continue, but API routes will fail at runtime without credentials
  }
}

initializeFirebaseAdmin();

export { adminApp, adminAuth, adminDb };

// Verify ID token from client
export async function verifyIdToken(token: string): Promise<any> {
  if (!adminAuth) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Get user by ID
export async function getUserById(uid: string): Promise<any> {
  if (!adminDb) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  try {
    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    return userDoc.data();
  } catch (error) {
    throw error;
  }
}
