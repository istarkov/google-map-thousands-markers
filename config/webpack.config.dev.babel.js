/* eslint-disable import/no-extraneous-dependencies */
// New webpack config for cnr-frontend
// TODO production config https://github.com/facebookincubator/create-react-app/blob/master/config/webpack.config.prod.js
import path from 'path';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import babelConfig from './babel.dev';
import paths from './paths';

// remove all of this when we move project onto babel 6
export default {
  devtool: 'cheap-source-map',
  entry: [
    `${require.resolve('webpack-dev-server/client')}?/`,
    require.resolve('webpack/hot/dev-server'),
    require.resolve('react-hot-loader/patch'),
    // path.join(paths.appSrc, 'polyfills'),
    path.join(paths.appSrc, 'main'),
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: '/',
  },
  devServer: {
    progress: true,
    colors: true,
    host: '0.0.0.0',
    port: (process.env.PORT || 3000),
    inline: true,
    hot: true,
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      // 'react-components-markdown': path.join(__dirname, '../src'),
    },
    modulesDirectories: [
      paths.appSrc,
      'node_modules',
    ],
    extensions: ['', '.web.js', '.js', '.jsx'], // eslint-disable-line
  },
  resolveLoader: {
    root: paths.appNodeModules,
  },
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] }),
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      favicon: paths.appFavicon,
    }),
    // new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
    new CaseSensitivePathsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        query: babelConfig,
        include: [
          paths.appSrc,
          __dirname,
        ],
      },
      {
        test: /\.sass$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]', // [hash:5]
          'postcss-loader',
          `sass-loader?precision=10&indentedSyntax=sass&includePaths[]=${paths.appStylesIncludes}`,
        ],
        include: [
          paths.appSrc,
        ],
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]', // [hash:5]
          'postcss-loader',
        ],
        include: [
          paths.appSrc,
          paths.appNodeModules,
        ],
        exclude: [
          path.join(paths.appNodeModules, 'react-virtualized'),
          path.join(paths.appNodeModules, 'slick-carousel'),
        ],
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader', // [hash:5]
          'postcss-loader',
        ],
        include: [
          path.join(paths.appNodeModules, 'react-virtualized'),
          path.join(paths.appNodeModules, 'slick-carousel'),
        ],
      },
      {
        test: /\.(?:svg|png|jpg)$/,
        loaders: ['url-loader?limit=7000'],
      },
      {
        test: /\.(?:txt)$/,
        loaders: ['raw-loader'],
      }
    ],
  },
};
