import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

// PUBLIC_INTERFACE
export default function LoginForm({ onSwitchToRegister }) {
  const { login, isLoading, error } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    if (!email || !password) {
      setLocalError("Email and password are required.");
      return;
    }
    const result = await login(email, password);
    if (!result.success && result.error) {
      setLocalError(result.error);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {localError && <div className="error">{localError}</div>}
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        autoFocus
        placeholder="Email"
        value={email}
        disabled={isLoading}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        disabled={isLoading}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button className="btn" type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
      <div style={{ marginTop: 12 }}>
        Don't have an account?{" "}
        <button type="button" className="btn-link" onClick={onSwitchToRegister} disabled={isLoading}>
          Register
        </button>
      </div>
    </form>
  );
}
