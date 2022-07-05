/**
 * Set dev run routes.
 *
 * @returns {object}
 */
const setDevRoutes = () => ({
  routes: {
    '/auth': {
      host: `http://localhost:5000`
    },
    '/api/rhsm-subscriptions': {
      host: `http://localhost:5000`
    }
  }
});

/**
 * Set proxy run routes.
 *
 * @param {object} params
 * @param {string} params.DEV_PORT
 * @param {string} params.BETA_PREFIX
 * @returns {object}
 */
const setProxyRoutes = ({ DEV_PORT, BETA_PREFIX = '' } = {}) => ({
  routes: {
    '/locales': {
      host: `https://localhost:${DEV_PORT}${BETA_PREFIX}/apps/subscriptions`
    }
  }
});

module.exports = { setDevRoutes, setProxyRoutes };
