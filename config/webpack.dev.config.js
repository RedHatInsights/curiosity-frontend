const {
  // babelLoaderResolve,
  cssLoaderResolve,
  sassLoaderResolve,
  tsLoaderResolve,
  EslintWebpackPlugin,
  MiniCssExtractPlugin
} = require('weldable/lib/packages');

module.exports = ({ SRC_DIR } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(jsx|js)?$/,
        include: [SRC_DIR],
        // use: [babelLoaderResolve]
        use: [tsLoaderResolve]
      },
      {
        test: /\.(sa|sc)ss$/i,
        use: [MiniCssExtractPlugin.loader, cssLoaderResolve, sassLoaderResolve]
      }
    ]
  },
  plugins: [
    new EslintWebpackPlugin({
      context: SRC_DIR,
      failOnError: false
    })
  ]
});
