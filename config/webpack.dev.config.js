const {
  // babelLoaderResolve,
  cssLoaderResolve,
  sassLoaderResolve,
  tsLoaderResolve,
  EslintWebpackPlugin,
  MiniCssExtractPlugin
} = require('weldable/lib/packages');

module.exports = ({ SRC_DIR, MOCK_PORT } = {}) => ({
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
  ],
  devServer: {
    proxy: [
      {
        context: ['/api'],
        target: `http://localhost:${MOCK_PORT}`,
        secure: false
      }
    ]
  }
});
