import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  Auth,
  AuthError,
} from 'firebase/auth';
import { auth, db } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';

// Types
export interface AuthUser {
  id: string;
  email: string | null;
  fullName?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

// Sign up with email and password
export async function signUp(
  email: string,
  password: string,
  fullName: string
): Promise<AuthUser> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      email: user.email,
      fullName: fullName,
      createdAt: Timestamp.now(),
    });

    return {
      id: user.uid,
      email: user.email,
      fullName: fullName,
    };
  } catch (error) {
    throw formatAuthError(error);
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<AuthUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    return {
      id: user.uid,
      email: user.email,
      fullName: userData?.fullName || '',
    };
  } catch (error) {
    throw formatAuthError(error);
  }
}

// Sign in with Google
export async function signInWithGoogle(): Promise<AuthUser> {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user profile exists, if not create it
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        id: user.uid,
        email: user.email,
        fullName: user.displayName || '',
        createdAt: Timestamp.now(),
      });
    }

    return {
      id: user.uid,
      email: user.email,
      fullName: user.displayName || '',
    };
  } catch (error) {
    throw formatAuthError(error);
  }
}

// Sign out
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw formatAuthError(error);
  }
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// Listen to auth state changes
export function onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
  return firebaseOnAuthStateChanged(auth, async (user) => {
    if (user) {
      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      callback({
        id: user.uid,
        email: user.email,
        fullName: userData?.fullName || '',
      });
    } else {
      callback(null);
    }
  });
}

// Format Firebase auth errors
function formatAuthError(error: unknown): Error {
  if (error instanceof Error && 'code' in error) {
    const firebaseError = error as AuthError;
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'Cet email n\'existe pas.',
      'auth/wrong-password': 'Le mot de passe est incorrect.',
      'auth/email-already-in-use': 'Cet email est déjà utilisé.',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
      'auth/invalid-email': 'Email invalide.',
      'auth/user-disabled': 'Ce compte a été désactivé.',
      'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
      'auth/operation-not-allowed': 'Cette opération n\'est pas autorisée.',
    };

    const message = errorMessages[firebaseError.code || ''] || firebaseError.message;
    const err = new Error(message);
    (err as any).code = firebaseError.code;
    return err;
  }

  return new Error(
    'Une erreur est survenue lors de l\'authentification. Veuillez réessayer.'
  );
}

// Save quiz result
export async function saveQuizResult(
  userId: string,
  answers: Record<string, any>,
  recommendations: string[]
): Promise<string> {
  try {
    const userQuizResultsRef = collection(db, 'users', userId, 'quizResults');
    const newDocRef = doc(userQuizResultsRef);
    
    await setDoc(newDocRef, {
      answers,
      recommendations,
      createdAt: Timestamp.now(),
    });

    return newDocRef.id;
  } catch (error) {
    throw formatAuthError(error);
  }
}

// Get quiz results history
export async function getQuizResults(userId: string): Promise<any[]> {
  try {
    const userQuizResultsRef = collection(db, 'users', userId, 'quizResults');
    const snapshot = await getDocs(userQuizResultsRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw formatAuthError(error);
  }
}

// Delete quiz result
export async function deleteQuizResult(userId: string, resultId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'users', userId, 'quizResults', resultId));
  } catch (error) {
    throw formatAuthError(error);
  }
}

// Save orientation response
export async function saveOrientationResponse(
  userId: string,
  questionId: string,
  responseData: Record<string, any>
): Promise<string> {
  try {
    const userResponsesRef = collection(db, 'users', userId, 'orientationResponses');
    const newDocRef = doc(userResponsesRef);
    
    await setDoc(newDocRef, {
      questionId,
      responseData,
      createdAt: Timestamp.now(),
    });

    return newDocRef.id;
  } catch (error) {
    throw formatAuthError(error);
  }
}

// Get orientation responses
export async function getOrientationResponses(userId: string): Promise<any[]> {
  try {
    const userResponsesRef = collection(db, 'users', userId, 'orientationResponses');
    const snapshot = await getDocs(userResponsesRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw formatAuthError(error);
  }
}
