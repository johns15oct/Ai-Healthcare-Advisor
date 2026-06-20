import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  isGuest: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (name: string, email: string, password: string) => Promise<string | null>;
  loginAsGuest: () => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function authError(error: unknown): string {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code.includes("invalid-credential")) return "Incorrect email or password.";
  if (code.includes("email-already-in-use")) return "An account already exists for this email.";
  if (code.includes("operation-not-allowed")) return "This sign-in method must be enabled in Firebase Authentication.";
  if (code.includes("network-request-failed")) return "Unable to reach Firebase. Check your connection.";
  return "Firebase could not complete the request. Please try again.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (firebaseUser) => {
    setUser(firebaseUser ? {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Guest User",
      email: firebaseUser.email || "Guest account",
      isGuest: firebaseUser.isAnonymous,
    } : null);
    setLoading(false);
  }), []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (error) {
      return authError(error);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    if (!name.trim()) return "Name required";
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name.trim() });
      setUser({ uid: credential.user.uid, name: name.trim(), email, isGuest: false });
      return null;
    } catch (error) {
      return authError(error);
    }
  };

  const loginAsGuest = async () => {
    try {
      await signInAnonymously(auth);
      return null;
    } catch (error) {
      return authError(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginAsGuest, logout: () => signOut(auth) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
