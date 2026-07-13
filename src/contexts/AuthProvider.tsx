import type { User as FirebaseUser } from "firebase/auth";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
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
  // Cache local de perfis definidos manualmente (login/register).
  // Evita que o listener de auth apague o usuário quando o documento
  // do Firestore ainda não terminou de ser criado/propagado.
  const localProfilesRef = useRef<Map<string, User>>(new Map());

  const rememberProfile = (uid: string, profile: User) => {
    localProfilesRef.current.set(uid, profile);
  };

  const refreshProfile = async () => {
    const currentUser = firebaseUser;
    if (!currentUser) return;

    const profile = await getUserProfile(currentUser.uid);
    if (profile) {
      rememberProfile(currentUser.uid, profile);
      setUser(profile);
    }
  };

  useEffect(() => {
    return subscribeAuth(async (nextFirebaseUser) => {
      setLoading(true);
      setFirebaseUser(nextFirebaseUser);

      if (!nextFirebaseUser) {
        localProfilesRef.current.clear();
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile =
          (await getUserProfile(nextFirebaseUser.uid)) ??
          localProfilesRef.current.get(nextFirebaseUser.uid) ??
          null;

        if (profile) {
          rememberProfile(nextFirebaseUser.uid, profile);
        }

        setUser(profile);
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

          rememberProfile(credential.user.uid, profile);
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
          rememberProfile(credential.user.uid, profile);
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
