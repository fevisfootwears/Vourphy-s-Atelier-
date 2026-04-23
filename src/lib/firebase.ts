import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { 
  initializeFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  getDocs, 
  serverTimestamp, 
  orderBy, 
  setDoc, 
  getDoc,
  where 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use initializeFirestore with experimentalForceLongPolling for more robust connectivity in restricted environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || '(default)');

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signOut = () => auth.signOut();

// Role Helpers
export const checkIfMarketer = async (uid: string) => {
  try {
    const docRef = doc(db, 'marketers', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, 'get', `marketers/${uid}`);
    }
    throw error;
  }
};

export const registerMarketer = async (user: User) => {
  try {
    const docRef = doc(db, 'marketers', user.uid);
    return await setDoc(docRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      registeredAt: serverTimestamp()
    }, { merge: true });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, 'write', `marketers/${user.uid}`);
    }
    throw error;
  }
};

export const getMarketers = async () => {
  try {
    const q = query(collection(db, 'marketers'), orderBy('registeredAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, 'list', 'marketers');
    }
    throw error;
  }
};

// Referral Lead Helpers
export const saveReferralLead = async (marketerUsername: string, type: 'with_marketer' | 'no_marketer') => {
  try {
    return await addDoc(collection(db, 'referralLeads'), {
      marketerUsername,
      type,
      timestamp: serverTimestamp(),
      clientSession: Math.random().toString(36).substring(7)
    });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, 'create', 'referralLeads');
    }
    throw error;
  }
};

export const getReferralLeads = async () => {
  try {
    const q = query(collection(db, 'referralLeads'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, 'list', 'referralLeads');
    }
    throw error;
  }
};

// Branding Helpers
export const getBranding = async () => {
  try {
    const logoRef = doc(db, 'branding', 'logo');
    const heroRef = doc(db, 'branding', 'hero');
    
    const [logoSnap, heroSnap] = await Promise.all([
      getDoc(logoRef),
      getDoc(heroRef)
    ]).catch(err => {
      console.warn("Branding fetch partially failed:", err);
      return [null, null];
    });

    return {
      logoUrl: (logoSnap && logoSnap.exists()) ? logoSnap.data().url : '',
      heroUrl: (heroSnap && heroSnap.exists()) ? heroSnap.data().url : ''
    };
  } catch (error) {
    console.error("Failed to fetch site branding:", error);
    return { logoUrl: '', heroUrl: '' };
  }
};

export const updateBranding = async (type: 'logo' | 'hero', url: string) => {
  const docRef = doc(db, 'branding', type);
  return await setDoc(docRef, { url, updatedAt: serverTimestamp() }, { merge: true });
};

// Site Assets (Artisan, Bespoke, Journal, Profile) Helpers
export const getSiteAssets = async (category: 'artisan' | 'bespoke' | 'journal' | 'profile') => {
  try {
    const q = query(
      collection(db, 'siteAssets'), 
      where('category', '==', category),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn(`Direct fetch for ${category} failed (likely missing index), falling back to filter:`, error);
    try {
      const q = query(collection(db, 'siteAssets'), orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const allAssets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return allAssets.filter((a: any) => a.category === category);
    } catch (innerError) {
      console.error("Fallback fetch failed:", innerError);
      return [];
    }
  }
};

export const updateSiteAsset = async (id: string, data: { url: string, category: string, title?: string }) => {
  const docRef = doc(db, 'siteAssets', id);
  return await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

export const addSiteAsset = async (data: { url: string, category: string, title?: string }) => {
  return await addDoc(collection(db, 'siteAssets'), {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteSiteAsset = async (id: string) => {
  return await deleteDoc(doc(db, 'siteAssets', id));
};

// Product CRUD Helpers
export const getProducts = async () => {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, 'list', 'products');
    }
    throw error;
  }
};

export const addProduct = async (product: any) => {
  try {
    return await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: serverTimestamp()
    });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, 'create', 'products');
    }
    throw error;
  }
};

export const updateProduct = async (id: string, product: any) => {
  try {
    return await updateDoc(doc(db, 'products', id), product);
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, 'update', `products/${id}`);
    }
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    return await deleteDoc(doc(db, 'products', id));
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, 'delete', `products/${id}`);
    }
    throw error;
  }
};

/**
 * Validates connection to Firestore
 */
async function testConnection() {
  try {
    const connectionDoc = doc(db, 'test', 'connection');
    await getDocFromServer(connectionDoc);
    console.log("Firestore connection verified.");
  } catch (error: any) {
    if (error.message && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: Client appears to be offline.");
    } else if (error.code === 'permission-denied') {
        console.log("Firestore reachable (Permission Denied - expected if rules are tight).");
    } else {
        console.error("Firestore connectivity error:", error);
    }
  }
}

testConnection();

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

export function handleFirestoreError(error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null = null): never {
  const user = auth.currentUser;
  
  const errorInfo: FirestoreErrorInfo = {
    error: error.message || 'Unknown Firestore error',
    operationType,
    path,
    authInfo: user ? {
      userId: user.uid,
      email: user.email || '',
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      providerInfo: user.providerData.map(p => ({
        providerId: p.providerId,
        displayName: p.displayName || '',
        email: p.email || ''
      }))
    } : {
      userId: 'unauthenticated',
      email: '',
      emailVerified: false,
      isAnonymous: true,
      providerInfo: []
    }
  };

  throw new Error(JSON.stringify(errorInfo));
}
