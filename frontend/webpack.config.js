const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin =
//   require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

let config = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
    })
  ],
};

module.exports = (env, argv) => {
  config.mode = argv.mode;
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
    config.devServer = {
      static: path.join(__dirname, './src'),
      historyApiFallback: true,
      port: 3000,
      proxy: {
        '/api/v1/*': process.env.API_URL || 'http://localhost:6969/',
        '/events': {
          target: process.env.WS_URL || 'ws://localhost:6969',
          ws: true
        }
      },
      hot: 'only',
      compress: true,
      open: true,
    };
  }

  if (argv.mode === 'production') {
    config.entry = ['./src'];
    config.devtool = 'source-map';
    config.output.filename = '[name].[chunkhash].bundle.js';
    config.output.chunkFilename = '[name].[chunkhash].bundle.js';
    config.optimization = {
      moduleIds: 'deterministic',
      runtimeChunk: {
        name: 'manifest',
      },
    };
    config.plugins.push(
      // new BundleAnalyzerPlugin({
      //   analyzerMode: 'static',
      // }),
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
        verbose: true
      }),
      new CompressionPlugin({
        test: /(\.ts|\.tsx)(\?.*)?$/i,
        filename: '[path][query]',
        algorithm: 'gzip',
        deleteOriginalAssets: false,
      }),
    );
    config.performance = {
      hints: 'warning',
      // Calculates sizes of gziped bundles.
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js.gz');
      },
    };
  }

  return config;
};
