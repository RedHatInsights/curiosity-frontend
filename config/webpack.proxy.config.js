const config = require('@redhat-cloud-services/frontend-components-config');
const { setReplacePlugin, setCommonPlugins } = require('./build.plugins');
const { setupDotenvFilesForEnv } = require('./build.dotenv');

const {
  _BUILD_RELATIVE_DIRNAME,
  REACT_APP_UI_DEPLOY_PATH_PREFIX: BETA_PREFIX,
  DEV_BRANCH,
  DEV_PORT
} = setupDotenvFilesForEnv({
  env: 'proxy'
});

const UPDATED_BETA_PREFIX = [BETA_PREFIX];

switch (BETA_PREFIX) {
  case '/preview':
    UPDATED_BETA_PREFIX.push('/beta');
    break;
  case '/beta':
  default:
    UPDATED_BETA_PREFIX.push('/preview');
    break;
}

const { config: webpackConfig, plugins } = config({
  appUrl: (() => {
    const urls = [];
    UPDATED_BETA_PREFIX.forEach(path => {
      urls.push(
        `${path}/insights/subscriptions`,
        `${path}/openshift/subscriptions`,
        `${path}/application-services/subscriptions`,
        `${path}/subscriptions/usage`
      );
    });
    return urls;
  })(),
  client: { overlay: false },
  debug: true,
  deployment: (/beta/.test(BETA_PREFIX) && 'beta/apps') || (/preview/.test(BETA_PREFIX) && 'preview/apps') || 'apps',
  env: (/(prod|stage|qa|ci)(-stable|-beta)$/.test(DEV_BRANCH) && DEV_BRANCH) || 'stage-stable',
  port: Number.parseInt(DEV_PORT, 10),
  rootFolder: _BUILD_RELATIVE_DIRNAME,
  standalone: false,
  useProxy: true,
  replacePlugin: setReplacePlugin()
});

plugins.push(...setCommonPlugins());

module.exports = {
  ...webpackConfig,
  plugins
};
