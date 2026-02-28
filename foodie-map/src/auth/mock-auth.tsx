import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppRole = "user" | "mark";
export type MarkRequestStatus = "none" | "pending" | "approved";

export type AuthState = {
  isAuthenticated: boolean;
  name: string;
  email: string;
  role: AppRole;
  markRequest: MarkRequestStatus;
};

type AuthContextType = {
  auth: AuthState;
  login: (email: string, name?: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
  requestMark: () => void;
  approveMarkMock: () => void;
};

const STORAGE_KEY = "foodie-map-auth";

const defaultState: AuthState = {
  isAuthenticated: false,
  name: "",
  email: "",
  role: "user",
  markRequest: "none",
};

function getInitialAuthState(): AuthState {
  if (typeof window === "undefined") {
    return defaultState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultState;
  }

  try {
    const parsed = JSON.parse(raw) as AuthState;
    return {
      ...defaultState,
      ...parsed,
    };
  } catch {
    return defaultState;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(getInitialAuthState);

  const persist = (next: AuthState) => {
    setAuth(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  };

  const login = (email: string, name?: string) => {
    persist({
      ...auth,
      isAuthenticated: true,
      email,
      name: name ?? (auth.name || "Foodie User"),
    });
  };

  const register = (name: string, email: string) => {
    persist({
      isAuthenticated: true,
      name,
      email,
      role: "user",
      markRequest: "none",
    });
  };

  const logout = () => {
    persist(defaultState);
  };

  const requestMark = () => {
    if (!auth.isAuthenticated) {
      return;
    }

    persist({
      ...auth,
      markRequest: auth.markRequest === "approved" ? "approved" : "pending",
    });
  };

  const approveMarkMock = () => {
    if (!auth.isAuthenticated) {
      return;
    }

    persist({
      ...auth,
      role: "mark",
      markRequest: "approved",
    });
  };

  const value = useMemo(
    () => ({ auth, login, register, logout, requestMark, approveMarkMock }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
