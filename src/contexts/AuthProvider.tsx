import type { User as FirebaseUser } from "firebase/auth";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import {
  login as firebaseLogin,
  logout as firebaseLogout,
  register as firebaseRegister,
  requestPasswordReset as firebaseRequestPasswordReset,
  subscribeAuth,
} from "@/services/firebase/auth";
import { getFriendlyError } from "@/services/firebase/errors";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
} from "@/repositories/users.repository";
import type { LoginDTO, RegisterDTO, User, UserRole } from "@/types";

type AuthContextValue = {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  login: (dto: LoginDTO) => Promise<User>;
  register: (dto: RegisterDTO) => Promise<User>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const currentUser = firebaseUser;
    if (!currentUser) return;

    const profile = await getUserProfile(currentUser.uid);
    setUser(profile);
  };

  useEffect(() => {
    return subscribeAuth(async (nextFirebaseUser) => {
      setLoading(true);
      setFirebaseUser(nextFirebaseUser);

      if (!nextFirebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setUser(await getUserProfile(nextFirebaseUser.uid));
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      user,
      role: user?.role ?? null,
      loading,
      login: async (dto) => {
        try {
          const credential = await firebaseLogin(dto.email, dto.password);
          const profile = await getUserProfile(credential.user.uid);

          if (!profile) {
            throw new Error("Perfil não encontrado no Firestore.");
          }

          setUser(profile);
          return profile;
        } catch (error) {
          throw new Error(getFriendlyError(error));
        }
      },
      register: async (dto) => {
        try {
          const credential = await firebaseRegister(dto.email, dto.password, dto.fullName);
          const profile = await createUserProfile(credential.user.uid, dto, credential.user.email ?? dto.email);
          setUser(profile);
          return profile;
        } catch (error) {
          throw new Error(getFriendlyError(error));
        }
      },
      logout: firebaseLogout,
      requestPasswordReset: async (email) => {
        try {
          await firebaseRequestPasswordReset(email);
        } catch (error) {
          throw new Error(getFriendlyError(error));
        }
      },
      updateProfile: async (profile) => {
        if (!user) return;

        const nextUser = {
          ...user,
          ...profile,
          name: profile.fullName ?? profile.name ?? user.name,
        };

        await updateUserProfile(user.id, nextUser);
        setUser(nextUser);
      },
      refreshProfile,
    }),
    [firebaseUser, loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
