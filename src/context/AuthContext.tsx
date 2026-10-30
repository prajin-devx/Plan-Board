import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  guestUser: { uid: string; displayName: string; email: string } | null;
  effectiveUserId: string;
  isGuest: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const GUEST_STORAGE_KEY = 'planboard_guest_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestUser, setGuestUser] = useState<{ uid: string; displayName: string; email: string } | null>(() => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return {
      uid: 'guest_user_planboard',
      displayName: 'Productive Planner',
      email: 'planner@planboard.app',
    };
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.warn('Sign-in cancelled or failed:', error);
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (error) {
      console.warn('Sign-out failed:', error);
    }
  };

  const continueAsGuest = () => {
    const guest = {
      uid: 'guest_user_planboard',
      displayName: 'Productive Planner',
      email: 'planner@planboard.app',
    };
    setGuestUser(guest);
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guest));
  };

  const isGuest = !user;
  const effectiveUserId = user ? user.uid : (guestUser?.uid || 'guest_user_planboard');

  return (
    <AuthContext.Provider
      value={{
        user,
        guestUser,
        effectiveUserId,
        isGuest,
        loading,
        signInWithGoogle,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
