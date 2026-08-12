// Firebase Authentication & Firestore Database Integration
import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  updateProfile, 
  signOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  getDocFromServer,
  Unsubscribe
} from 'firebase/firestore';

import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };

  if (errMessage.includes('permission-denied') || errMessage.includes('Missing or insufficient permissions')) {
    console.error('Firestore Permission Error:', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  } else {
    console.warn(`Firestore [${operationType}] warning at ${path}:`, errMessage);
  }
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('closing'))) {
      console.warn("Firestore connection check note:", error.message);
    }
  }
}
testConnection();

export interface UserProfile {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  isOnline: boolean;
  lastSeen?: string;
  friendIds: string[];
  friendRequestsSent: string[];
  friendRequestsReceived: string[];
  stats?: {
    ucTasWins: number;
    ucTasLosses: number;
    dokuzTasWins: number;
    dokuzTasLosses: number;
  };
}

// User Profile Firestore Sync
export async function syncUserProfile(user: User, customName?: string): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  const name = customName || user.displayName || `Oyuncu-${user.uid.slice(0, 5)}`;
  const photo = user.photoURL || '';

  if (!snap.exists()) {
    const newProfile: UserProfile = {
      uid: user.uid,
      displayName: name,
      email: user.email || undefined,
      photoURL: photo,
      isOnline: true,
      friendIds: [],
      friendRequestsSent: [],
      friendRequestsReceived: [],
      stats: {
        ucTasWins: 0,
        ucTasLosses: 0,
        dokuzTasWins: 0,
        dokuzTasLosses: 0,
      }
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  } else {
    await updateDoc(userRef, {
      isOnline: true,
      lastSeen: new Date().toISOString(),
      ...(customName ? { displayName: customName } : {})
    });
    const updatedSnap = await getDoc(userRef);
    return updatedSnap.data() as UserProfile;
  }
}

// Login Helper (Google or Custom Display Name Anonymous Login)
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      return await syncUserProfile(result.user);
    }
  } catch (err) {
    console.error('Google Sign in failed:', err);
    throw err;
  }
}

export async function loginAsGuest(guestName: string): Promise<UserProfile> {
  try {
    const cred = await signInAnonymously(auth);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: guestName });
      return await syncUserProfile(cred.user, guestName);
    }
  } catch (err: any) {
    console.warn('Firebase Anonymous sign-in unavailable or restricted, falling back to local guest profile:', err?.code || err);
  }

  // Fallback local guest user profile
  let localGuestUid = localStorage.getItem('local_guest_uid');
  if (!localGuestUid) {
    localGuestUid = 'guest_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('local_guest_uid', localGuestUid);
  }

  const localProfile: UserProfile = {
    uid: localGuestUid,
    displayName: guestName,
    isOnline: true,
    friendIds: [],
    friendRequestsSent: [],
    friendRequestsReceived: [],
    stats: {
      ucTasWins: 0,
      ucTasLosses: 0,
      dokuzTasWins: 0,
      dokuzTasLosses: 0,
    }
  };

  try {
    // Try syncing to firestore if database permits
    const userRef = doc(db, 'users', localGuestUid);
    await setDoc(userRef, localProfile, { merge: true }).catch(() => {});
  } catch (e) {
    // Ignore firestore write error if unauthenticated
  }

  return localProfile;
}

export async function logoutUser() {
  if (auth.currentUser) {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, { isOnline: false, lastSeen: new Date().toISOString() }).catch(() => {});
  }
  return signOut(auth);
}

// Friend System
export async function sendFriendRequest(currentUid: string, targetUid: string) {
  if (currentUid === targetUid) return;
  const currentRef = doc(db, 'users', currentUid);
  const targetRef = doc(db, 'users', targetUid);

  await updateDoc(currentRef, {
    friendRequestsSent: arrayUnion(targetUid)
  });
  await updateDoc(targetRef, {
    friendRequestsReceived: arrayUnion(currentUid)
  });
}

export async function acceptFriendRequest(currentUid: string, friendUid: string) {
  const currentRef = doc(db, 'users', currentUid);
  const friendRef = doc(db, 'users', friendUid);

  await updateDoc(currentRef, {
    friendRequestsReceived: arrayRemove(friendUid),
    friendIds: arrayUnion(friendUid)
  });
  await updateDoc(friendRef, {
    friendRequestsSent: arrayRemove(currentUid),
    friendIds: arrayUnion(currentUid)
  });
}

export async function rejectFriendRequest(currentUid: string, friendUid: string) {
  const currentRef = doc(db, 'users', currentUid);
  const friendRef = doc(db, 'users', friendUid);

  await updateDoc(currentRef, {
    friendRequestsReceived: arrayRemove(friendUid)
  });
  await updateDoc(friendRef, {
    friendRequestsSent: arrayRemove(currentUid)
  });
}

export async function removeFriend(currentUid: string, friendUid: string) {
  const currentRef = doc(db, 'users', currentUid);
  const friendRef = doc(db, 'users', friendUid);

  await updateDoc(currentRef, {
    friendIds: arrayRemove(friendUid)
  });
  await updateDoc(friendRef, {
    friendIds: arrayRemove(currentUid)
  });
}

export async function searchUsersByName(searchQuery: string): Promise<UserProfile[]> {
  if (!searchQuery.trim()) return [];
  const usersRef = collection(db, 'users');
  const snap = await getDocs(usersRef);
  const results: UserProfile[] = [];
  const qLower = searchQuery.toLowerCase().trim();

  snap.forEach((docSnap) => {
    const data = docSnap.data() as UserProfile;
    if (data.displayName && data.displayName.toLowerCase().includes(qLower)) {
      results.push(data);
    }
  });

  return results.slice(0, 10);
}

// Leaderboard & Game Stats Sync
export async function getLeaderboard(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, 'users');
    const snap = await getDocs(usersRef);
    const users: UserProfile[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as UserProfile;
      users.push(data);
    });

    // Sort by dokuzTasWins descending
    users.sort((a, b) => {
      const winsA = a.stats?.dokuzTasWins || 0;
      const winsB = b.stats?.dokuzTasWins || 0;
      return winsB - winsA;
    });

    return users.slice(0, 25);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return [];
  }
}

export async function recordGameResult(winnerUid?: string, loserUid?: string) {
  if (winnerUid) {
    try {
      const winnerRef = doc(db, 'users', winnerUid);
      const snap = await getDoc(winnerRef);
      if (snap.exists()) {
        const currentWins = snap.data().stats?.dokuzTasWins || 0;
        await updateDoc(winnerRef, {
          'stats.dokuzTasWins': currentWins + 1
        });
      }
    } catch (err) {
      console.warn("Could not update winner stats:", err);
    }
  }

  if (loserUid) {
    try {
      const loserRef = doc(db, 'users', loserUid);
      const snap = await getDoc(loserRef);
      if (snap.exists()) {
        const currentLosses = snap.data().stats?.dokuzTasLosses || 0;
        await updateDoc(loserRef, {
          'stats.dokuzTasLosses': currentLosses + 1
        });
      }
    } catch (err) {
      console.warn("Could not update loser stats:", err);
    }
  }
}
