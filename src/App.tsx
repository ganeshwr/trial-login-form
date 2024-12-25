// React built-in
import { useEffect, useState, FC } from "react";

// Components
import LoginScreen from "./components/LoginScreen";
import AccountScreen from "./components/AccountScreen";
import Loading from "./components/LoadingScreen";

// Helper & misc
import { getUsersData } from "./api";
import { UserList } from "./types/UserList";
import { User } from "./types/User";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./store/authContext";

// 3rd party
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const App: FC = () => {
  const [users, setUsers] = useState<UserList>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        let data = await getUsersData();
        data = data.reduce((prev: User[], { id, email, username }: User) => {
          prev.push({ id, email, username });
          return prev;
        }, []);
        setUsers(data);
      } catch (err: any) {
        setUsers([]);
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginScreen users={users} />
              </GuestRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountScreen />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
