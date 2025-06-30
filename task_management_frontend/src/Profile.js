import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

// PUBLIC_INTERFACE
export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="profile-card">
      <h2>Your Profile</h2>
      <div><b>Name:</b> {user.name}</div>
      <div><b>Email:</b> {user.email}</div>
      <button className="btn" style={{ marginTop: 20 }} onClick={logout}>
        Logout
      </button>
    </div>
  );
}
