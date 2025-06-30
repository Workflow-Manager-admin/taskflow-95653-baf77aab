import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

// PUBLIC_INTERFACE
export default function RegisterForm({ onSwitchToLogin }) {
  const { register, isLoading, error } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    if (!name || !email || !password) {
      setLocalError("Name, email, and password are required.");
      return;
    }
    const result = await register(name, email, password);
    if (!result.success && result.error) {
      setLocalError(result.error);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Register</h2>
      {localError && <div className="error">{localError}</div>}
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        disabled={isLoading}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={isLoading}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={isLoading}
        required
      />
      <button className="btn" type="submit" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </button>
      <div style={{ marginTop: 12 }}>
        Already have an account?{" "}
        <button type="button" className="btn-link" onClick={onSwitchToLogin} disabled={isLoading}>
          Login
        </button>
      </div>
    </form>
  );
}
