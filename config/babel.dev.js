export default {
  babelrc: false,
  cacheDirectory: true,
  presets: [
    'babel-preset-latest',
    'babel-preset-react',
    'babel-preset-stage-0',
  ].map(require.resolve),

  plugins: [
    'markdown-in-js/babel',
    'react-hot-loader/babel',
    'babel-plugin-transform-runtime',
  ].map(require.resolve),
};
