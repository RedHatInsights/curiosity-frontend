const config = require('@redhat-cloud-services/frontend-components-config');
const { setHtmlPlugin, setReplacePlugin, setCommonPlugins } = require('./build.plugins');
const { setupDotenvFilesForEnv } = require('./build.dotenv');

const { _BUILD_RELATIVE_DIRNAME, DEV_BRANCH, DEV_PORT } = setupDotenvFilesForEnv({
  env: 'development'
});

const { config: webpackConfig, plugins } = config({
  appUrl: ['/insights/subscriptions', '/openshift/subscriptions'],
  debug: true,
  deployment: 'apps',
  env: (/(prod|qa|ci)(-stable|-beta)$/.test(DEV_BRANCH) && DEV_BRANCH) || 'prod-stable',
  port: Number.parseInt(DEV_PORT, 10),
  rootFolder: _BUILD_RELATIVE_DIRNAME,
  skipChrome2: true,
  standalone: true,
  useProxy: false,
  htmlPlugin: setHtmlPlugin(),
  replacePlugin: setReplacePlugin()
});

plugins.push(...setCommonPlugins());

module.exports = {
  ...webpackConfig,
  plugins
};
