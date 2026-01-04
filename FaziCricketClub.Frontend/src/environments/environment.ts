// Development environment configuration
export const environment = {
  production: false,

  // API URLs - matching backend launchSettings.json
  apiUrl: 'http://localhost:5062/api',           // Main API
  identityApiUrl: 'http://localhost:5105/api',   // Identity API

  // Auth settings
  tokenKey: 'fazi_access_token',
  refreshTokenKey: 'fazi_refresh_token',
  userKey: 'fazi_user',

  // Token expiry buffer (refresh token 5 minutes before expiry)
  tokenExpiryBuffer: 5 * 60 * 1000, // 5 minutes in milliseconds
};
