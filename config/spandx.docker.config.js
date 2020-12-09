const localhost = (process.env.PLATFORM === 'linux' && 'localhost') || 'host.docker.internal';

module.exports = {
  bs: {
    https: true
  },
  routes: {
    '/locales': {
      host: `http://${localhost}:5001`
    },
    '/static': {
      host: `http://${localhost}:5001`
    },
    '/apps/subscriptions': {
      host: `http://${localhost}:5001`
    },
    '/beta/apps/subscriptions': {
      host: `http://${localhost}:5001`
    },
    '/staging/subscriptions': {
      host: `http://${localhost}:5001`
    },
    '/beta/staging/subscriptions': {
      host: `http://${localhost}:5001`
    },
    '/subscriptions': {
      host: `http://${localhost}:5001`
    },
    '/beta/subscriptions': {
      host: `http://${localhost}:5001`
    },
    '/api/rhsm-subscriptions': {
      host: 'https://ci.cloud.redhat.com'
    }
  }
};
