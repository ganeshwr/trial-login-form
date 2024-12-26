// React built-in
import { useState, FC, FormEvent } from "react";

// Components
import LanguageSwitcher from "./LanguageSwitcher";

// Helper & misc
import { validateEmail, validatePassword } from "../utils/validate";
import { useAuth } from "../store/authContext";
import { useGlobalTranslation } from "../utils/useGlobalTranslation";

// 3rd party
import { Title, Button, Flex, Input, Password, Alert, Text } from "rizzui";
import {
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const Login: FC = () => {
  const { t } = useGlobalTranslation()
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [errorGeneral, setErrorGeneral] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (
      validateEmail(email).rule == "required" &&
      !validateEmail(email).valid
    ) {
      setErrorEmail("login.validation.email_required");
      hasError = true;
    }

    if (validateEmail(email).rule == "pattern" && !validateEmail(email).valid) {
      setErrorEmail("login.validation.email_invalid");
      hasError = true;
    }

    if (!validatePassword(password)) {
      setErrorPassword("login.validation.password_required");
      hasError = true;
    }

    if (hasError) {
      hasError = false;
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (err: any) {
      setErrorGeneral(
        err.message == "username or password is incorrect"
          ? t("login.incorrect_credential")
          : err.message
      );
    }
    setLoading(false);
  };

  return (
    <Flex
      align="center"
      justify="center"
      className="min-h-dvh py-3 overflow-auto"
      direction="col"
    >
      <Title>{t("login.login_page")}</Title>
      <form
        onSubmit={handleLogin}
        className="flex gap-10 flex-col w-3/12 min-w-64"
      >
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
              <Text className="font-semibold">{t("login.login_failed")}</Text>
              <Text>{errorGeneral}</Text>
            </Alert>
          )}
          <Flex direction="col">
            <Input
              label={t("login.email")}
              placeholder={t("login.email_placeholder")}
              disabled={loading}
              onClear={() => setEmail("")}
              clearable={!loading}
              className="w-full"
              prefix={<EnvelopeIcon className="w-4" />}
              value={email}
              onInput={() => setErrorEmail("")}
              onChange={(e) => setEmail(e.target.value)}
              error={t(errorEmail)}
            />
            <Password
              label={t("login.password")}
              placeholder={t("login.password_placeholder")}
              disabled={loading}
              onClear={() => setPassword("")}
              clearable={!loading}
              className="w-full"
              prefix={<LockClosedIcon className="w-4" />}
              value={password}
              onInput={() => setErrorPassword("")}
              onChange={(e) => setPassword(e.target.value)}
              error={t(errorPassword)}
            />
          </Flex>
        </Flex>
        <Button type="submit" isLoading={loading}>
          {t("login.btn_login")}
        </Button>
      </form>
      <LanguageSwitcher/>
    </Flex>
  );
};

export default Login;
