// Production environment configuration
export const environment = {
  production: true,

  // API URLs - update these for production deployment
  apiUrl: 'https://api.fazcricketclub.com/api',
  identityApiUrl: 'https://identity.fazcricketclub.com/api',

  // Auth settings
  tokenKey: 'fazi_access_token',
  refreshTokenKey: 'fazi_refresh_token',
  userKey: 'fazi_user',

  // Token expiry buffer
  tokenExpiryBuffer: 5 * 60 * 1000,
};
