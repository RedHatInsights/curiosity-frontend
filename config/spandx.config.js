const localhost = (process.env.PLATFORM === 'linux' && 'localhost') || 'host.docker.internal';

module.exports = {
  routes: {
    '/': {
      host: `http://${localhost}:5001`
    },
    '/apps/subscription-reporting': {
      host: `http://${localhost}:5001`
    },
    '/staging/subscription-reporting': {
      host: `http://${localhost}:5001`
    },
    '/api': {
      host: 'https://ci.cloud.paas.psi.redhat.com'
    }
  }
};
