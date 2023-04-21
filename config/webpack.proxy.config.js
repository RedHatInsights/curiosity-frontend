const config = require('@redhat-cloud-services/frontend-components-config');
const { setReplacePlugin, setCommonPlugins } = require('./build.plugins');
const { setupDotenvFilesForEnv } = require('./build.dotenv');
const { setProxyRoutes } = require('./spandx.config');

const { _BUILD_RELATIVE_DIRNAME, DEV_BRANCH, DEV_PORT } = setupDotenvFilesForEnv({
  env: 'proxy'
});

let ENV_PREFIX = '';

if (/(prod|stage|qa|ci)-beta/.test(DEV_BRANCH)) {
  ENV_PREFIX = '/preview';
}

const { config: webpackConfig, plugins } = config({
  appUrl: [
    `${ENV_PREFIX}/insights/subscriptions`,
    `${ENV_PREFIX}/openshift/subscriptions`,
    `${ENV_PREFIX}/application-services/subscriptions`
  ],
  client: { overlay: false },
  debug: true,
  deployment: (/preview/.test(ENV_PREFIX) && 'preview/apps') || (/beta/.test(ENV_PREFIX) && 'beta/apps') || 'apps',
  env: (/(prod|stage|qa|ci)(-stable|-beta)$/.test(DEV_BRANCH) && DEV_BRANCH) || 'stage-stable',
  port: Number.parseInt(DEV_PORT, 10),
  rootFolder: _BUILD_RELATIVE_DIRNAME,
  routes: setProxyRoutes({ DEV_PORT, ENV_PREFIX }),
  standalone: false,
  useProxy: true,
  replacePlugin: setReplacePlugin()
});

plugins.push(...setCommonPlugins());

module.exports = {
  ...webpackConfig,
  plugins
};
