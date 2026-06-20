import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { VitalReading } from "../data/mockData";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  height: string;
  allergies: string;
  conditions: string;
}

interface HealthContextType {
  readings: VitalReading[];
  loading: boolean;
  error: string | null;
  addReading: (reading: Omit<VitalReading, "id">) => Promise<void>;
  updateReading: (id: string, reading: Omit<VitalReading, "id">) => Promise<void>;
  deleteReading: (id: string) => Promise<void>;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => Promise<void>;
}

const EMPTY_PROFILE: UserProfile = {
  name: "",
  age: "",
  gender: "Prefer not to say",
  height: "",
  allergies: "",
  conditions: "",
};

const HealthContext = createContext<HealthContextType | null>(null);

export function HealthProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [readings, setReadings] = useState<VitalReading[]>([]);
  const [profile, setProfileState] = useState<UserProfile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReadings([]);
    setProfileState(EMPTY_PROFILE);
    setError(null);
    if (!user) return;

    setLoading(true);
    const readingsQuery = query(collection(db, "users", user.uid, "readings"), orderBy("date", "asc"));
    const stopReadings = onSnapshot(readingsQuery, (snapshot) => {
      setReadings(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as VitalReading)));
      setLoading(false);
    }, () => {
      setError("Unable to load health data. Check Firestore setup and security rules.");
      setLoading(false);
    });

    const stopProfile = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (snapshot.exists()) setProfileState({ ...EMPTY_PROFILE, ...snapshot.data() } as UserProfile);
    });

    return () => {
      stopReadings();
      stopProfile();
    };
  }, [user]);

  const readingsCollection = () => {
    if (!user) throw new Error("Sign in before saving health data.");
    return collection(db, "users", user.uid, "readings");
  };

  const addReading = async (reading: Omit<VitalReading, "id">) => {
    setError(null);
    try {
      await addDoc(readingsCollection(), reading);
    } catch {
      setError("Reading could not be saved to Firebase.");
      throw new Error("Reading could not be saved to Firebase.");
    }
  };

  const updateReading = async (id: string, reading: Omit<VitalReading, "id">) => {
    if (!user) throw new Error("Sign in before updating health data.");
    await setDoc(doc(db, "users", user.uid, "readings", id), reading);
  };

  const deleteReading = async (id: string) => {
    if (!user) throw new Error("Sign in before deleting health data.");
    await deleteDoc(doc(db, "users", user.uid, "readings", id));
  };

  const setProfile = async (nextProfile: UserProfile) => {
    if (!user) throw new Error("Sign in before saving your profile.");
    await setDoc(doc(db, "users", user.uid), nextProfile, { merge: true });
  };

  return (
    <HealthContext.Provider value={{ readings, loading, error, addReading, updateReading, deleteReading, profile, setProfile }}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) throw new Error("useHealth must be used within HealthProvider");
  return context;
}
