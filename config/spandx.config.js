/**
 * Set proxy routes.
 *
 * @param {object} params
 * @param {string} params.DEV_PORT
 * @param {string} params.BETA_PREFIX
 * @returns {object}
 */
const setProxyRoutes = ({ DEV_PORT, BETA_PREFIX = '' }) => ({
  routes: {
    '/locales': {
      host: `https://localhost:${DEV_PORT}${BETA_PREFIX}/apps/subscriptions`
    }
  }
});

module.exports = setProxyRoutes;
