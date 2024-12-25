// React built-in
import { useState, FC } from "react";

// Helper & misc
import { login } from "../api";
import { validateEmail, validatePassword } from "../utils/validate";
import { UserList } from "../types/UserList";
import { TokenPayload } from "../types/TokenPayload";
import ls from "../utils/secureLs";

// 3rd party
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  users: UserList;
}

const Login: FC<LoginProps> = ({ users }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password is required");
      return;
    }

    try {
      const targetUser = users.find((user) => user.email == email);
      const data = await login(targetUser?.username ?? email, password);

      const decodedToken = jwtDecode<TokenPayload>(data.token);
      ls.set("tokenPayload", { ...decodedToken });

      navigate("/account");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
