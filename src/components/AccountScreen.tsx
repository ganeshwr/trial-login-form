// React built-in
import { useState, useEffect, FC, useRef, ReactNode } from "react";

// Components
import Loading from "./LoadingScreen";

// Helper & misc
import { MY_PROFILE_QUERY } from "../api";
import { User } from "../types/User";
import { useAuth } from "../store/authContext";
import { useGlobalTranslation } from "../utils/useGlobalTranslation";
import client from "../apolloClient";

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
import LanguageSwitcher from "./LanguageSwitcher";

const Account: FC = () => {
  const { t } = useGlobalTranslation();
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isClipped, setIsClipped] = useState<boolean>(false);
  const [confirmLogout, setConfirmLogout] = useState<boolean>(false);
  const navigate = useNavigate();
  const spanRef = useRef<HTMLSpanElement>(null);

  const inputStyles = () => ({
    width: `${(spanRef.current?.offsetWidth || 1) + 2}px`,
  });

  // Fetching current logged in user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await client.query({
          query: MY_PROFILE_QUERY,
        });
        setUser(data.myProfile);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [client]);

  // Calculating whether full name is cut off or not
  useEffect(() => {
    const inputElement = document.getElementById("input-full-name");
    if (inputElement) {
      console.log(inputElement, user?.name);
      setIsClipped(inputElement.scrollWidth > inputElement.clientWidth);
    }
  }, [user]);

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
      value={user?.name}
      className="min-w-52 max-w-xl box-border"
    />
  );
  // If full name is clipped, show tooltip (showing complete full name) when hovering on the input
  if (isClipped) {
    inputFullName = (
      <Tooltip content={user?.name}>
        <Input
          id="input-full-name"
          disabled
          size="xl"
          style={inputStyles()}
          value={user?.name}
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
        <Flex justify="end" align="center" className="gap-0">
          <LanguageSwitcher />
          <Button
            size="xl"
            variant="text"
            onClick={() => setConfirmLogout(true)}
            className="self-end"
          >
            {t("account.btn_logout")}
            <ArrowRightStartOnRectangleIcon
              strokeWidth="2"
              className="h-4 w-4 ml-2"
            />
          </Button>
        </Flex>
        {error ? (
          <Flex
            direction="col"
            justify="center"
            align="center"
            className="min-h-dvh overflow-auto pb-12"
          >
            <Alert
              size="xl"
              color="danger"
              className="w-fit"
              icon={<ExclamationTriangleIcon className="w-8 text-red-600" />}
            >
              <Text className="font-semibold">
                {t("account.unexpected_error.title")}
              </Text>
              <Text>{t("account.unexpected_error.message")}</Text>
            </Alert>
          </Flex>
        ) : (
          <Flex
            className="grow pb-12"
            direction="col"
            align="center"
            justify="center"
          >
            <Title>{t("account.account_details")}</Title>
            <Flex direction="col" gap="1" className="w-fit">
              <Text>{t("account.user_id")}</Text>
              <Input
                disabled
                size="xl"
                style={inputStyles()}
                value={user?.id}
                className="min-w-52 max-w-xl"
              />
            </Flex>
            <Flex direction="col" gap="1" className="w-fit">
              <Text>{t("account.name")}</Text>
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
                {user?.name || " "}
              </span>
            </Flex>
          </Flex>
        )}
      </Flex>
      <Modal
        size="sm"
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
      >
        <div className="m-auto px-7 pt-6 pb-8">
          <div className="mb-7 flex items-center justify-between">
            <Title as="h3">{t("account.confirm_logout.title")}</Title>
            <ActionIcon
              size="sm"
              variant="text"
              onClick={() => setConfirmLogout(false)}
            >
              <XMarkIcon className="h-auto w-6" strokeWidth={1.8} />
            </ActionIcon>
          </div>
          <Text className="mb-7">{t("account.confirm_logout.message")}</Text>
          <Flex justify="end">
            <Button onClick={() => setConfirmLogout(false)} variant="flat">
              {t("account.confirm_logout.btn_negative")}
            </Button>
            <Button onClick={onLogout} color="danger">
              {t("account.confirm_logout.btn_positive")}
            </Button>
          </Flex>
        </div>
      </Modal>
    </>
  );
};

export default Account;
