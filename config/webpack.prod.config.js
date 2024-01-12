const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const config = require('@redhat-cloud-services/frontend-components-config');
const { dotenv } = require('weldable');
const { setReplacePlugin, setCommonPlugins } = require('./build.plugins');

const {
  _BUILD_RELATIVE_DIRNAME,
  REACT_APP_UI_DEPLOY_PATH_PREFIX: BETA_PREFIX,
  DEV_ANALYZE
} = dotenv.setupDotenvFilesForEnv({ env: process.env.NODE_ENV });

const { config: webpackConfig, plugins } = config({
  rootFolder: _BUILD_RELATIVE_DIRNAME,
  deployment: (/beta/.test(BETA_PREFIX) && 'beta/apps') || (/preview/.test(BETA_PREFIX) && 'preview/apps') || 'apps',
  replacePlugin: setReplacePlugin()
});

plugins.push(...setCommonPlugins());

if (DEV_ANALYZE === 'true') {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  ...webpackConfig,
  plugins
};
