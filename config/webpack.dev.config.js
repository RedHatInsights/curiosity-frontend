const config = require('@redhat-cloud-services/frontend-components-config');
const { setReplacePlugin, setCommonPlugins } = require('./build.plugins');
const { setupDotenvFilesForEnv } = require('./build.dotenv');
const { setDevRoutes } = require('./spandx.config');

const { _BUILD_RELATIVE_DIRNAME, DEV_BRANCH, DEV_PORT } = setupDotenvFilesForEnv({ env: process.env.NODE_ENV });

const { config: webpackConfig, plugins } = config({
  appUrl: [
    '/insights/subscriptions',
    '/openshift/subscriptions',
    '/application-services/subscriptions',
    '/subscriptions'
  ],
  client: { overlay: false },
  debug: true,
  deployment: 'apps',
  env: (/(prod|stage|qa|ci)(-stable|-beta)$/.test(DEV_BRANCH) && DEV_BRANCH) || 'prod-stable',
  port: Number.parseInt(DEV_PORT, 10),
  rootFolder: _BUILD_RELATIVE_DIRNAME,
  routes: setDevRoutes(),
  standalone: true,
  useProxy: false,
  replacePlugin: setReplacePlugin()
});

plugins.push(...setCommonPlugins());

module.exports = {
  ...webpackConfig,
  plugins
};
