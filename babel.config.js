const { setupDotenvFilesForEnv } = require('./config/build.dotenv');
setupDotenvFilesForEnv({ env: process.env.NODE_ENV || 'production' });

module.exports = {
  presets: ['react-app']
};
