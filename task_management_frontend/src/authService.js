const API_BASE = "/api";

// PUBLIC_INTERFACE
export const authApi = {
  /**
   * PUBLIC_INTERFACE
   * Login with user credentials.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Login failed");
    }
    return res.json();
  },

  /**
   * PUBLIC_INTERFACE
   * Register a new user.
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{token: string, user: object}>}
   */
  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Registration failed");
    }
    return res.json();
  },

  /**
   * PUBLIC_INTERFACE
   * Get current user profile by token.
   * @param {string} token
   * @returns {Promise<object>}
   */
  async getProfile(token) {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      if (res.status === 401) throw new Error("Session expired/login required");
      throw new Error("Failed to fetch profile");
    }
    return res.json();
  }
};
