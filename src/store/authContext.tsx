// React built-in
import { createContext, useContext, useState, ReactNode, FC } from "react";

// Helper & misc
import { AuthContextProps } from "../types/AuthContextProps";
import { UserList } from "../types/UserList";
import { TokenPayload } from "../types/TokenPayload";
import { doLogin } from "../api";
import ls from "../utils/secureLs";

// 3rd party
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (email: string, password: string, users: UserList) => {
    try {
      const targetUser = users.find((user) => user.email == email);
      const data = await doLogin(targetUser?.username ?? email, password);

      const decodedToken = jwtDecode<TokenPayload>(data.token);
      ls.set("tokenPayload", { ...decodedToken });
      setIsAuthenticated(true);
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    ls.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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