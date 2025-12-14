// API Configuration
const API_CONFIG = {
  BASE_URL:
    window.ENV_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "http://localhost:5000"),
};

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = API_CONFIG;
}
