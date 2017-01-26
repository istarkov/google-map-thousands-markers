import React from 'react';
import compose from 'recompose/compose';
import { themr } from 'react-css-themr';
import markdown from 'markdown-in-js';
import { Link } from 'react-router';
import Container from './Container';
import contentStyles from './content.sass';

const Data = ({ theme }) => markdown({
  a: ({ href, children }) => (
    <a href={href} target={'_blank'}>{children}</a>
  ),
})`
# How to draw thousands markers on the map

[Example of drawing 10000 animated on hover markers](https://istarkov.github.io/google-map-thousands-markers/)

## The problem

With few thousands markers on the map a single hover animation over any marker will be slow.<br/>
It's not because of javascript, it's because browser can't render them fast.<br/>
All that layer composition events becomes too slow to show any single animation.

## The solution

To draw markers on the html 5 canvas, and to hold a small buffer of components to draw hover events.

## How to run locally

clone and cd into the project.

run

\`\`\`shell
yarn
yarn run start
\`\`\`

## Why

For unknown reasons some clients don't like any clustering on the map.

## PS

Example is highly unoptimized BTW it works well.<br/>
Also you can use this project as an example how to draw anything over the [google-map-react](https://github.com/istarkov/google-map-react)

##
`;

export const content = ({ theme }) => (
  <div className={theme.main}>
    <Container>
      <Data theme={theme} />
    </Container>
  </div>
);

export const contentHOC = compose(
  themr('content', contentStyles)
);

export default contentHOC(content);
