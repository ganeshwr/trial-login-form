// React built-in
import { useState, useEffect, FC } from "react";

// Components
import Loading from "./LoadingScreen";

// Helper & misc
import { getUserDataById } from "../api";
import { User } from "../types/User";
import { TokenPayload } from "../types/TokenPayload";
import ls from "../utils/secureLs";

// 3rd party
import { useNavigate } from "react-router-dom";

const Account: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const tokenPayload: TokenPayload = ls.get("tokenPayload");

      try {
        const data = await getUserDataById(tokenPayload.sub);
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  const onLogout = () => {
    ls.clear();
    navigate("/login");
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <div>
      <h2>Account Details</h2>
      <p>First Name: {user.email}</p>
      <p>Last Name: {user.username}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Account;
