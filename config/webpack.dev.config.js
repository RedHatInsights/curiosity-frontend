const {
  cssLoaderResolve,
  sassLoaderResolve,
  EslintWebpackPlugin,
  MiniCssExtractPlugin
} = require('weldable/lib/packages');

module.exports = ({ SRC_DIR, MOCK_PORT } = {}) => ({
  module: {
    rules: [
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
