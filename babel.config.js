const { dotenv } = require('weldable');
const { babelPresetEnvResolve, babelPresetReact } = require('weldable/lib/packages');
const { NODE_ENV } = dotenv.setupDotenvFilesForEnv({ env: process.env.NODE_ENV || 'production' });
const { browserslist } = require('./package.json');

module.exports = {
  targets:
    (NODE_ENV === 'development' && browserslist?.development?.join(', ')) ||
    browserslist?.production?.join(', ') ||
    'entry',
  presets: [babelPresetEnvResolve, babelPresetReact]
};
