import React from 'react';
import compose from 'recompose/compose';
import { themr } from 'react-css-themr';
import markdown from 'markdown-in-js';
import { Link } from 'react-router';
import contentStyles from './content.sass';

const Data = ({ theme }) => markdown({
  a: ({ href, children }) => (
    <a href={href} target={'_blank'}>{children}</a>
  ),
})`
[**This example**](https://github.com/istarkov/pbl) the&nbsp;
${<Link className={theme.link} to={'/err'}>build process output and error(s)</Link>}&nbsp;
will
remain
available.
*More information available [here](https://github.com/istarkov/pbl)*
`;

export const content = ({ theme }) => (
  <div className={theme.main}>
    <div className={theme.data}>
      <Data theme={theme} />
    </div>
  </div>
);

export const contentHOC = compose(
  themr('content', contentStyles)
);

export default contentHOC(content);
