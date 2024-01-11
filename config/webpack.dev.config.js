const { EslintWebpackPlugin, MiniCssExtractPlugin } = require('weldable/lib/packages');

module.exports = ({ _BUILD_SRC: SRC_DIR } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(sa|sc)ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
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
