import React from 'react';
import compose from 'recompose/compose';
import { themr } from 'react-css-themr';
import containerStyles from './container.sass';

export const container = ({ theme, children }) => (
  <div className={theme.component}>
    <div className={theme.contentAside} />
    <div className={theme.content}>
      {children}
    </div>
    <div className={theme.contentAside} />
  </div>
);

export const containerHOC = compose(
  themr('container', containerStyles)
);

export default containerHOC(container);
