/* eslint-disable max-len, import/no-extraneous-dependencies */
import path from 'path';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import babelConfig from './babel.prod';
import paths from './paths';

// Development builds of React are slow and not intended for production.
if (process.env.NODE_ENV !== 'production') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

const publicPath = process.env.BUILD ? `/${paths.githubProject}/` : '/';

const envObj = Object.keys(process.env)
  .reduce((r, k) => ({
    ...r,
    [k]: JSON.stringify(process.env[k]),
  }), {
    NODE_ENV: '"development"',
  });

// remove all of this when we move project onto babel 6
export default {
  // Don't attempt to continue if there are any errors.
  bail: true,
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: 'source-map',
  entry: {
    // In production, we only want to load the polyfills and the app code.
    app: [
      // path.join(paths.appSrc, 'polyfills'),
      path.join(paths.appSrc, 'main'),
    ],
    vendor: [
      'react',
      'react-dom',
      'recompose',
      'react-router',
    ],
  },
  output: {
    // The build folder.
    path: process.env.BUILD || paths.appBuild,
    // Generated JS file names (with nested folders).
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath,
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
  recordsPath: path.resolve(__dirname, '.webpack-records.json'),
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      favicon: paths.appFavicon,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    // new webpack.optimize.CommonsChunkPlugin('vendor', 'static/js/vendor.[chunkhash:8].js'),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
    }),
    new webpack.DefinePlugin({
      'process.env': envObj,
    }),
    // This helps ensure the builds are consistent if source hasn't changed:
    new webpack.optimize.OccurrenceOrderPlugin(),
    // Try to dedupe duplicated modules, if any:
    new webpack.optimize.DedupePlugin(),
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    new ExtractTextPlugin('static/css/[name].[contenthash:8].css'),
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
        loader: ExtractTextPlugin.extract(
          'style-loader',
          [
            'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]', // [hash:5]
            'postcss-loader',
            `sass-loader?precision=10&indentedSyntax=sass&includePaths[]=${paths.appStylesIncludes}`,
          ],
        ),
        include: [
          paths.appSrc,
        ],
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          [
            'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]', // [hash:5]
            'postcss-loader',
          ],
        ),
        include: [
          paths.appSrc,
          paths.appNodeModules,
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
