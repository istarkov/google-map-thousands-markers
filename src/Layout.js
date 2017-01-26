import React from 'react';
import { themr } from 'react-css-themr';
import compose from 'recompose/compose';
import { Link } from 'react-router';
import MatchWithProps from './enhancers/MatchWithProps';
import Container from './Container';
import Content from './Content';
import Map from './Map';
import layoutStyles from './layout.sass';

const layoutComponent = ({
  theme, state, dispatch,
}) => (
  <div className={theme.component}>
    <div className={theme.header}>
      <Container theme={theme} themeNamespace={'header'}>
        <div className={theme.headerLeft}>
          <Link className={theme.headerText} to={'/'}>MAP</Link>
          <span className={theme.preLinkText}>with thousands markers</span>
        </div>
        <div className={theme.headerMenu}>
          <span className={theme.preLinkText}>see it at </span>
          <a
            className={theme.link}
            href={'https://github.com/istarkov/google-map-thousands-markers'}
          >
            github
          </a>
        </div>
      </Container>
    </div>
    <div className={theme.content}>
      <MatchWithProps
        exactly
        pattern="/"
        component={Map}
        state={state}
        dispatch={dispatch}
      />
      <MatchWithProps
        exactly
        pattern="/about"
        component={Content}
        state={state}
        dispatch={dispatch}
      />
    </div>
    <div className={theme.footer}>
      <Container theme={theme} themeNamespace={'footer'}>
        <span className={theme.team}>created by</span> &nbsp;
        <a className={theme.link} href={'https://github.com/istarkov'}>istarkov</a>
      </Container>
    </div>
  </div>
);

export const layoutHOC = compose(
  themr('layout', layoutStyles),
);

export default layoutHOC(layoutComponent);
