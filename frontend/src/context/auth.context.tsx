import { createContext, useContext, useEffect, useState } from "react";
import { setAccessToken } from "@/lib/token";
import { refreshAccessToken } from "@/axios";
import { getMe } from "@/services/auth.services";
import type { UserTypes } from "@/types/user.types";

type AuthContextType = {
  user: UserTypes | null;
  loading: boolean;
  login: (user: UserTypes, token: string) => void;
  logout: () => void;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserTypes | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (user: UserTypes, token: string) => {
    setUser(user);
    setAccessToken(token);
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
  };

  const refreshUser = async () => {
    const me = await getMe();
    setUser(me);
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const accessToken = await refreshAccessToken();
        setAccessToken(accessToken);

        const me = await getMe();
        setUser(me);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return context;
}
