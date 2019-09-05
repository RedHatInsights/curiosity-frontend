const localhost = (process.env.PLATFORM === 'linux' && 'localhost') || 'host.docker.internal';

module.exports = {
  routes: {
    '/': {
      host: `http://${localhost}:5001`
    },
    '/apps/subscriptions': {
      host: `http://${localhost}:5001`
    },
    '/staging/subscriptions': {
      host: `http://${localhost}:5001`
    },
    '/subscriptions': {
      host: `http://${localhost}:5001`
    },
    '/api': {
      host: 'https://ci.cloud.redhat.com'
    }
  }
};
