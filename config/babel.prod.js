export default {
  babelrc: false,
  presets: [
    'babel-preset-es2015',
    'babel-preset-es2016',
    'babel-preset-react',
    'babel-preset-stage-0',
  ].map(require.resolve),

  plugins: [
    'markdown-in-js/babel',
    'babel-plugin-transform-runtime',
  ].map(require.resolve),
};
