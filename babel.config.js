const { setupDotenvFilesForEnv } = require('./config/build.dotenv');
const { NODE_ENV } = setupDotenvFilesForEnv({ env: process.env.NODE_ENV || 'production' });
const { browserslist } = require('./package.json');

module.exports = {
  targets:
    (NODE_ENV === 'development' && browserslist?.development?.join(', ')) ||
    browserslist?.production?.join(', ') ||
    'entry',
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: ['@babel/plugin-transform-runtime']
};
