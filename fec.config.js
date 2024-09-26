const path = require('path');
const { webpack, CopyWebpackPlugin } = require('weldable/lib/packages');
const { dotenv } = require('weldable');
const { dependencies } = require('./package.json');

const {
  // DEV_BRANCH,
  _BUILD_DIST_DIR: DIST_DIR,
  _BUILD_STATIC_DIR: STATIC_DIR,
  HOT: _INSIGHTS_HOT,
  PROXY_VERBOSE: _INSIGHTS_PROXY_VERBOSE,
  REACT_APP_ENV: DOTENV_ENV
} = dotenv.setupDotenvFilesForEnv({ env: (process.env.NODE_ENV === 'development' && 'proxy') || process.env.NODE_ENV });

module.exports = {
  appUrl: '/subscriptions/usage',
  debug: true,
  // env: (/(prod|stage|qa|ci)(-stable|-beta)$/.test(DEV_BRANCH) && DEV_BRANCH) || 'stage-stable',
  useProxy: true,
  proxyVerbose: _INSIGHTS_PROXY_VERBOSE === 'true',
  interceptChromeConfig: false,
  plugins: [
    new webpack.IgnorePlugin({ resourceRegExp: /\.(md)$/ }),
    ...dotenv.setupWebpackDotenvFilesForEnv({ env: DOTENV_ENV }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.join(STATIC_DIR, 'locales'), to: path.join(DIST_DIR, 'locales'), noErrorOnMissing: true }]
    })
  ],
  ...(() => {
    if (_INSIGHTS_HOT === 'true') {
      return { _unstableHotReload: true };
    }
    return undefined;
  })(),
  moduleFederation: {
    // exclude: ['react-router-dom'],
    shared: [
      {
        'react-router-dom': {
          singleton: true,
          import: false,
          version: dependencies['react-router-dom']
        }
      }
    ]
  }
};
