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

  // Task management UI modal state
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

  let content;
  if (user) {
    // ----- Task Management UI Dashboard -----
    content = (
      <TaskProvider>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            maxWidth: 1100,
            margin: "0 auto",
            minHeight: 540,
            gap: 0,
          }}
        >
          {/* Filter Sidebar */}
          <TaskFilter />

          {/* Main area: List + Details */}
          <div style={{ flex: 2.5, padding: "22px 0 0 0", minWidth: 360 }}>
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
          {/* Details */}
          <div style={{ flex: 3, padding: "30px 10px" }}>
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
            onSubmit={() => {
              setShowNew(false);
            }}
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
        {/* User profile in upper right */}
        <div style={{ position: "fixed", top: 27, right: 30, zIndex: 9 }}>
          <Profile />
        </div>
      </TaskProvider>
    );
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
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", minHeight: 480 }}>
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
