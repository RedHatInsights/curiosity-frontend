/**
 * Set dev run routes.
 *
 * @returns {object}
 */
const setDevRoutes = () => ({
  routes: {
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
 * @param {string} params.ENV_PREFIX
 * @returns {object}
 */
const setProxyRoutes = ({ DEV_PORT, ENV_PREFIX = '' } = {}) => {
  console.log('>>>>> SET PROXY ROUTES', ENV_PREFIX);
  return {
    routes: {
      '/locales': {
        host: `https://localhost:${DEV_PORT}${ENV_PREFIX}/apps/subscriptions`
      }
    }
  };
};

module.exports = { setDevRoutes, setProxyRoutes };
