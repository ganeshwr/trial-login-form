// React built-in
import { useEffect, useState, FC } from "react";

// Components
import LoginScreen from "./components/LoginScreen";
import AccountScreen from "./components/AccountScreen";

// Helper & misc
import { getUsersData } from "./api";
import { UserList } from "./types/UserList";
import { User } from "./types/User";
import ls from "./utils/secureLs";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const App: FC = () => {
  const isAuthenticated = !!ls.get("tokenPayload");
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
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <Routes>
        {/* Redirect to login if not authenticated */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/account" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Login route */}
        <Route path="/login" element={<LoginScreen users={users} />} />

        {/* Protected Account route */}
        <Route
          path="/account"
          element={
            isAuthenticated ? <AccountScreen /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
    // <div>
    //   {tokenPayload ? (
    //     <AccountScreen tokenPayload={tokenPayload} onLogout={handleLogout} />
    //   ) : (
    //     <LoginScreen onLoginSuccess={handleLoginSuccess} users={users} />
    //   )}
    // </div>
  );
};

export default App;
