import { AppContainer } from 'react-hot-loader';
import { Observable } from 'rxjs';
import React from 'react';
import { render } from 'react-dom';
import webfontloader from 'webfontloader';
import setObservableConfig from 'recompose/setObservableConfig';
import 'normalize.css/normalize.css';
import './main.sass';
import App from './App';

const mountNode = document.getElementById('app');

setObservableConfig({
  fromESObservable: Observable.from,
});

webfontloader.load({
  google: {
    families: ['Roboto', 'Roboto Mono'],
  },
});

render(
  <AppContainer>
    <App />
  </AppContainer>,
  mountNode,
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default; // eslint-disable-line
    render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      mountNode,
    );
  });
}
