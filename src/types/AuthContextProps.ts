// Helper & misc
import { UserList } from "./UserList";

export interface AuthContextProps {
  isAuthenticated: boolean;
  login: (email: string, password: string, users: UserList) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
