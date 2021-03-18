const localhost = (process.env.PLATFORM === 'linux' && 'localhost') || 'host.docker.internal';

module.exports = {
  routes: {
    '/locales': {
      host: `https://${localhost}:5001`
    },
    '/static': {
      host: `https://${localhost}:5001`
    },
    '/apps/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/beta/apps/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/staging/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/beta/staging/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/beta/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/insights/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/beta/insights/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/rhel/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/beta/rhel/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/openshift/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/beta/openshift/subscriptions': {
      host: `https://${localhost}:5001`
    },
    '/api/rhsm-subscriptions': {
      host: 'https://ci.cloud.redhat.com'
    }
  }
};
