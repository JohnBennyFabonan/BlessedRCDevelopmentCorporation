// API Configuration
const API_CONFIG = {
  BASE_URL:
    window.ENV_API_URL ||
    (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://api.blessedrandcdevelopmentcorp.com"),
};

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = API_CONFIG;
}
