const localhost = (process.env.PLATFORM === 'linux' && 'localhost') || 'host.docker.internal';

module.exports = {
  routes: {
    '/locales': {
      host: `https://${localhost}:5001`
    },
    '/static': {
      host: `https://${localhost}:5001`
    },
    '/beta/apps/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/beta/staging/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/beta/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/api/rhsm-subscriptions': {
      host: 'https://ci.cloud.redhat.com'
    }
  }
};
