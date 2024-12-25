// React built-in
import { useState, useEffect, FC } from "react";

// Components
import Loading from "./LoadingScreen";

// Helper & misc
import { getUserDataById } from "../api";
import { User } from "../types/User";
import { TokenPayload } from "../types/TokenPayload";
import ls from "../utils/secureLs";
import { useAuth } from "../store/authContext";

// 3rd party
import { useNavigate } from "react-router-dom";
import { Input, Flex, Button } from "rizzui";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

const Account: FC = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
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
    logout()
    navigate("/login");
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <Flex direction="col" className="min-h-dvh overflow-auto gap-0">
      <Button variant="text" onClick={onLogout} className="self-end">
        Logout
        <ArrowRightStartOnRectangleIcon
          strokeWidth="2"
          className="h-4 w-4 ml-2"
        />
      </Button>
      <Flex className="bg-red-600 h-full">
        <h2>Account Details</h2>
        <p>First Name: {user.name?.firstname}</p>
        <p>Last Name: {user.name?.lastname}</p>
      </Flex>
    </Flex>
  );
};

export default Account;
