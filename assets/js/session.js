// /assets/js/session.js
// Small, focused session helper for all front-end pages.

const Session = {
  // Save session (called once on login)
  saveSession(user, token) {
    if (!user || !token) return;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("loggedIn", "true");
    // optional: store timestamp
    localStorage.setItem("sessionAt", new Date().toISOString());
  },

  // Get user object (parsed) or null
  getUser() {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  // Get token or null
  getToken() {
    return localStorage.getItem("token") || null;
  },

  // Check loggedIn flag
  isLoggedIn() {
    return localStorage.getItem("loggedIn") === "true" && !!this.getUser();
  },

  // Require a role — if not satisfied, redirect to login (returns true when ok)
  requireRole(role, redirectTo = "/login.html") {
    const user = this.getUser();
    if (!user || !this.isLoggedIn() || (role && user.role !== role)) {
      // do not clear other keys here - just redirect
      window.alert(`${role[0].toUpperCase()+role.slice(1)} access required.`);
      window.location.href = redirectTo;
      return false;
    }
    return true;
  },

  // Logout (clear only authentication keys)
  clearAuth() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("sessionAt");
  },

  logout(redirectTo = "/index.html") {
    this.clearAuth();
    window.location.href = redirectTo;
  }
};
