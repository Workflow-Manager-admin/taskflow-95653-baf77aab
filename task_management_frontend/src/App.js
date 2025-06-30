import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import { AuthProvider, AuthContext } from "./AuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Profile from "./Profile";

/**
 * Renders the main app content conditionally based on authentication state.
 */
function AppContent() {
  const [theme, setTheme] = useState("light");
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const { user, isLoading } = useContext(AuthContext);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  let content;
  if (user) {
    content = <Profile />;
  } else if (authMode === "login") {
    content = <LoginForm onSwitchToRegister={() => setAuthMode("register")} />;
  } else {
    content = <RegisterForm onSwitchToLogin={() => setAuthMode("login")} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <div style={{ width: "100%", maxWidth: 320, margin: "0 auto" }}>
          {content}
          {isLoading && <div style={{ marginTop: 16 }}>Loading...</div>}
        </div>
      </header>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Main App component wrapped in AuthProvider.
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
