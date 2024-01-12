const path = require('path');
const { webpack, CopyWebpackPlugin } = require('weldable/lib/packages');
const { dotenv } = require('weldable');

const {
  // DEV_BRANCH,
  DIST_DIR,
  STATIC_DIR,
  REACT_APP_ENV: DOTENV_ENV
} = dotenv.setupDotenvFilesForEnv({ env: (process.env.NODE_ENV === 'development' && 'proxy') || process.env.NODE_ENV });

module.exports = {
  appUrl: '/subscriptions/usage',
  debug: true,
  // env: (/(prod|stage|qa|ci)(-stable|-beta)$/.test(DEV_BRANCH) && DEV_BRANCH) || 'stage-stable',
  useProxy: true,
  proxyVerbose: true,
  interceptChromeConfig: false,
  plugins: [
    new webpack.IgnorePlugin({ resourceRegExp: /\.(md)$/ }),
    ...dotenv.setupWebpackDotenvFilesForEnv({ env: DOTENV_ENV }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.join(STATIC_DIR, 'locales'), to: path.join(DIST_DIR, 'locales'), noErrorOnMissing: true }]
    })
  ],
  ...(() => {
    if (process.env.HOT === 'true') {
      return { _unstableHotReload: true };
    }
    return undefined;
  })(),
  moduleFederation: {
    exclude: ['react-router-dom'],
    shared: [
      {
        'react-router-dom': {
          singleton: true,
          import: false,
          version: '^6.3.0'
        }
      }
    ]
  }
};
