// React built-in
import { useState, FC } from "react";

// Helper & misc
import { validateEmail, validatePassword } from "../utils/validate";
import { UserList } from "../types/UserList";
import { useAuth } from "../store/authContext";

// 3rd party
import { useNavigate } from "react-router-dom";
import { Title, Button, Flex, Input, Password, Alert, Text } from "rizzui";
import {
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface LoginProps {
  users: UserList;
}

const Login: FC<LoginProps> = ({ users }) => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [errorGeneral, setErrorGeneral] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/account", { replace: true });
    return
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (
      validateEmail(email).rule == "required" &&
      !validateEmail(email).valid
    ) {
      setErrorEmail("Email is required");
      hasError = true;
    }

    if (validateEmail(email).rule == "pattern" && !validateEmail(email).valid) {
      setErrorEmail("Invalid Email");
      hasError = true;
    }

    if (!validatePassword(password)) {
      setErrorPassword("Password is required");
      hasError = true;
    }

    if (hasError) {
      hasError = false;
      return;
    }

    try {
      setLoading(true);
      await login(email, password, users);
      navigate("/account");
    } catch (err: any) {
      setErrorGeneral(err.message);
    }
    setLoading(false);
  };

  return (
    <Flex align="center" justify="center" className="h-dvh" direction="col">
      <Title>Login Page</Title>
      <form onSubmit={handleLogin} className="flex gap-10 flex-col w-3/12">
        <Flex direction="col" gap="2">
          {errorGeneral.length > 0 && (
            <Alert
              className="my-2"
              size="sm"
              color="danger"
              icon={<ExclamationTriangleIcon className="w-6 text-red-600" />}
              variant="flat"
              bar
              closable
              onClose={() => setErrorGeneral("")}
            >
              <Text className="font-semibold">Failed to log in</Text>
              <Text>{errorGeneral}</Text>
            </Alert>
          )}
          <Flex direction="col" gap="1">
            <label>Email</label>
            <Input
              disabled={loading}
              onClear={() => setEmail("")}
              clearable={!loading}
              className="w-full"
              prefix={<EnvelopeIcon className="w-4" />}
              value={email}
              onInput={() => setErrorEmail("")}
              onChange={(e) => setEmail(e.target.value)}
              error={errorEmail}
            />
          </Flex>
          <Flex direction="col" gap="1">
            <label>Password</label>
            <Password
              disabled={loading}
              onClear={() => setPassword("")}
              clearable={!loading}
              className="w-full"
              prefix={<LockClosedIcon className="w-4" />}
              value={password}
              onInput={() => setErrorPassword("")}
              onChange={(e) => setPassword(e.target.value)}
              error={errorPassword}
            />
          </Flex>
        </Flex>
        <Button type="submit" isLoading={loading}>
          Login
        </Button>
      </form>
    </Flex>
  );
};

export default Login;
