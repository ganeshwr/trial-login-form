// React built-in
import { useState, useEffect, FC, useRef, ReactNode } from "react";

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
import {
  Input,
  Flex,
  Button,
  Title,
  Text,
  Tooltip,
  Alert,
  Modal,
  ActionIcon,
} from "rizzui";
import {
  ArrowRightStartOnRectangleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Account: FC = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isClipped, setIsClipped] = useState<boolean>(false);
  const [confirmLogout, setConfirmLogout] = useState<boolean>(false);
  const navigate = useNavigate();
  const spanRef = useRef<HTMLSpanElement>(null);
  const fullName: string = `${user?.name?.firstname} ${user?.name?.lastname}`;

  const inputStyles = () => ({
    width: `${(spanRef.current?.offsetWidth || 1) + 2}px`,
  });

  // Calculating whether full name is cut off or not
  useEffect(() => {
    const inputElement = document.getElementById("input-full-name");
    if (inputElement) {
      setIsClipped(inputElement.scrollWidth > inputElement.clientWidth);
    }
  }, [user]);

  // Fetching current logged in user data
  useEffect(() => {
    const fetchUserData = async () => {
      const tokenPayload: TokenPayload = ls.get("tokenPayload");
      try {
        const data = await getUserDataById(tokenPayload.sub);

        if (!data) throw new Error();

        setUser(data);
      } catch (err: any) {
        setError(err);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  // Input to contain user full name
  let inputFullName: ReactNode = (
    <Input
      id="input-full-name"
      disabled
      size="xl"
      style={inputStyles()}
      value={fullName}
      className="min-w-52 max-w-xl box-border"
    />
  );
  if (isClipped) {
    inputFullName = (
      <Tooltip content={fullName}>
        <Input
          id="input-full-name"
          disabled
          size="xl"
          style={inputStyles()}
          value={fullName}
          className="min-w-52 max-w-xl box-border"
        />
      </Tooltip>
    );
  }

  // Handle loading state
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Flex direction="col" className="min-h-dvh overflow-auto gap-0 h-full">
        <Button
          size="xl"
          variant="text"
          onClick={() => setConfirmLogout(true)}
          className="self-end"
        >
          Logout
          <ArrowRightStartOnRectangleIcon
            strokeWidth="2"
            className="h-4 w-4 ml-2"
          />
        </Button>
        {error ? (
          <Flex
            direction="col"
            justify="center"
            align="center"
            className="min-h-dvh overflow-auto"
          >
            <Alert
              size="xl"
              color="danger"
              className="w-fit"
              icon={<ExclamationTriangleIcon className="w-8 text-red-600" />}
            >
              <Text className="font-semibold">Unexpected Error</Text>
              <Text>Please try again later</Text>
            </Alert>
          </Flex>
        ) : (
          <Flex
            className="grow"
            direction="col"
            align="center"
            justify="center"
          >
            <Title>Account Details</Title>
            <Flex direction="col" gap="1" className="w-fit">
              <Text>User ID</Text>
              <Input
                disabled
                size="xl"
                style={inputStyles()}
                value={user?.id}
                className="min-w-52 max-w-xl"
              />
            </Flex>
            <Flex direction="col" gap="1" className="w-fit">
              <Text>Name {isClipped ? "true" : "false"}</Text>
              {inputFullName}

              {/* For calculating above inputs dynamic size based on user name length */}
              <span
                ref={spanRef}
                style={{
                  position: "absolute",
                  visibility: "hidden",
                  whiteSpace: "pre",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  fontWeight: "inherit",
                  letterSpacing: "inherit",
                }}
              >
                {fullName || " "}
              </span>
            </Flex>
          </Flex>
        )}
      </Flex>
      <Modal size="sm" isOpen={confirmLogout} onClose={() => setConfirmLogout(false)}>
        <div className="m-auto px-7 pt-6 pb-8">
          <div className="mb-7 flex items-center justify-between">
            <Title as="h3">Confirm logout</Title>
            <ActionIcon
              size="sm"
              variant="text"
              onClick={() => setConfirmLogout(false)}
            >
              <XMarkIcon className="h-auto w-6" strokeWidth={1.8} />
            </ActionIcon>
          </div>
          <Text className="mb-7">Are you sure you want to log out?</Text>
          <Flex justify="end">
            <Button onClick={() => setConfirmLogout(false)} variant="flat">Cancel</Button>
            <Button onClick={onLogout} color="danger">Yes, Log Out</Button>
          </Flex>
        </div>
      </Modal>
    </>
  );
};

export default Account;
