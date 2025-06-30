import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import { AuthProvider, AuthContext } from "./AuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Profile from "./Profile";

/**
 * Renders the main app content conditionally based on authentication state.
 */
import { TaskProvider } from "./TaskContext";
import TaskList from "./TaskList";
import TaskDetail from "./TaskDetail";
import TaskForm from "./TaskForm";
import TaskFilter from "./TaskFilter";

function ModalWrapper({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(20,24,28,0.26)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function AppContent() {
  const [theme, setTheme] = useState("light");
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const { user, isLoading } = useContext(AuthContext);

  // Modal state for task management UI
  const [showNew, setShowNew] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editInitial, setEditInitial] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      {/* Main navigation header */}
      <nav className="navbar">
        <div className="navbar__brand">
          <span style={{ color: "#1976d2" }}>Task</span>
          <span style={{ color: "#ca841c" }}>Flow</span>
        </div>
        <div className="navbar__links">
          {user && (
            <>
              <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)" }}>
                Welcome, {user.name}
              </span>
            </>
          )}
          <button
            className="theme-toggle"
            style={{ position: "static", top: "unset", right: "unset" }}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          {user && (
            <div className="navbar__profile" style={{ display: "inline-block" }}>
              {/* Profile will also appear in upper right in layout for consistency, so don't remove */}
              <Profile />
            </div>
          )}
        </div>
      </nav>
      <header className="App-header">
        {!user ? (
          <div style={{ width: "100%", maxWidth: "420px", margin: "70px auto 0 auto", minHeight: 420 }}>
            {authMode === "login"
              ? <LoginForm onSwitchToRegister={() => setAuthMode("register")} />
              : <RegisterForm onSwitchToLogin={() => setAuthMode("login")} />
            }
            {isLoading && <div style={{ marginTop: 16 }}>Loading...</div>}
          </div>
        ) : (
          <TaskProvider>
            <div className="layout-main">
              {/* Sidebar/filters */}
              <div className="sidebar">
                <TaskFilter />
              </div>
              {/* Main area: List + Details */}
              <div style={{ flex: 2.5, padding: "34px 0 0 0", minWidth: 320 }}>
                <TaskList
                  onSelect={() => {
                    // Task selection handled by context
                  }}
                  onCreate={() => {
                    setShowNew(true);
                    setEditInitial(null);
                  }}
                />
              </div>
              <div style={{ flex: 3, padding: "35px 3vw 0 16px" }}>
                <TaskDetail
                  onEdit={task => {
                    setShowEdit(true);
                    setEditInitial(task);
                  }}
                  onClose={() => {
                    setEditInitial(null);
                    setShowEdit(false);
                  }}
                />
              </div>
            </div>
            {/* Task Form MODALS */}
            <ModalWrapper open={showNew} onClose={() => setShowNew(false)}>
              <TaskForm
                onSubmit={() => setShowNew(false)}
                onCancel={() => setShowNew(false)}
              />
            </ModalWrapper>
            <ModalWrapper open={showEdit} onClose={() => setShowEdit(false)}>
              <TaskForm
                initial={editInitial}
                onSubmit={() => setShowEdit(false)}
                onCancel={() => setShowEdit(false)}
              />
            </ModalWrapper>
            {/* Optional: Profile floating (in layout, also in nav for consistency) */}
            <div style={{ position: "fixed", top: 75, right: 30, zIndex: 900 }}>
              <Profile />
            </div>
          </TaskProvider>
        )}
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
