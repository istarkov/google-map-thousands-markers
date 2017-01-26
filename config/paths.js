import path from 'path';

const BACKEND_URL = 'ws://localhost:4000'; // 'https://localhost';

export default {
  appBuild: path.join(__dirname, '../build'),
  appHtml: path.join(__dirname, './template/index.html'),
  appFavicon: path.join(__dirname, './template/avatar.png'),
  appSrc: path.join(__dirname, '../src'),
  appProxy: BACKEND_URL,
  appNodeModules: path.join(__dirname, '../node_modules'),
  appStylesIncludes: [
    path.resolve(__dirname, '../'),
    path.resolve(__dirname, '../node_modules'),
    path.resolve(__dirname, '../assets/sass'),
  ].join(':'),
  githubProject: 'google-map-thousands-markers',
};
