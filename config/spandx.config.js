const localhost = (process.env.PLATFORM === 'linux' && 'localhost') || 'host.docker.internal';

module.exports = {
  routes: {
    '/': {
      host: `http://${localhost}:5001`
    }
  }
};
