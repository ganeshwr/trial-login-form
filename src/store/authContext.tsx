// React built-in
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  useEffect,
} from "react";

// Helper & misc
import { AuthContextProps } from "../types/AuthContextProps";
import { LOGIN_MUTATION } from "../api";
import ls from "../utils/secureLs";

// 3rd party
import { useMutation } from "@apollo/client";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const keyName = "token"

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [doLogin] = useMutation(LOGIN_MUTATION);

  // Check local storage for token during the initial render
  useEffect(() => {
    if (!!ls.get(keyName)) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await doLogin({ variables: { email, password } });
      const { access_token, refresh_token } = data.login;

      ls.set(keyName, { access_token, refresh_token });
      setIsAuthenticated(true);
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    ls.remove(keyName);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
