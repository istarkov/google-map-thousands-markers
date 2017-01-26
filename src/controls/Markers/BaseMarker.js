// Base for all other markers
// Can be used as standalone marker
import React from 'react';
import omitBy from 'lodash/omitBy';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import mapProps from 'recompose/mapProps';
import withPropsOnChange from 'recompose/withPropsOnChange';
import pure from 'recompose/pure';
import { themr } from 'react-css-themr';
import { Motion, spring } from 'react-motion';
import cx from 'classnames';
import baseMarkerStyles from './BaseMarker.sass';

export const baseMarker = ({
  theme,
  animated,
  content,
  children,
  defaultMotionStyle,
  motionStyle,
  defaultScale,
  onMouseEnter,
  onMouseLeave,
}) => (
  <div
    className={theme.main}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {
      animated
        ? <Motion
          defaultStyle={defaultMotionStyle}
          style={motionStyle}
        >
          {
            ({ scale }) => (
              <div
                className={theme.marker}
                style={{
                  transform: `translate3D(0,0,0) scale(${scale}, ${scale})`,
                }}
              >
                {content}
              </div>
            )
          }
        </Motion>
        : <div
          className={theme.marker}
          style={{
            transform: `translate3D(0,0,0) scale(${defaultScale}, ${defaultScale})`,
          }}
        >
          {content}
        </div>
    }

    {/* marker content out of animation */}
    {children}
  </div>
);

export const baseMarkerHOC = compose(
  themr('baseMarker', baseMarkerStyles),
  defaultProps({
    // content can be element,
    // content is inside animated marker part children are not
    content: '',
    active: true,
    animated: true,
    // for most situations you should override theme
    // hover is set by parent component
    hover: false,
    // animation constants
    initialScale: 0.5, // scale on first occurence
    defaultScale: 1,
    hoveredScale: 1.1,
    stiffness: 420,
    damping: 7,
    precision: 0.05,
    hoveredDumping: 25,
    onMouseEnter: () => {},
    onMouseLeave: () => {},
  }),
  // transform string and number content to React Element
  withPropsOnChange(
    ['content'],
    ({ content, theme }) => ({
      content: isString(content) || isNumber(content)
        ? <div className={theme.content}>{content}</div>
        : content,
    })
  ),
  withPropsOnChange(
    ['initialScale'],
    ({ initialScale, defaultScale, $prerender }) => ({
      initialScale,
      defaultMotionStyle: { scale: $prerender ? defaultScale : initialScale },
    })
  ),
  withPropsOnChange(
    ['hover', 'externalHover', 'theme', 'active', 'isNew'],
    ({
      hover, theme, hoveredScale, defaultScale, isNew,
      stiffness, damping, hoveredDumping, precision, active,
      externalHover,
    }) => ({
      motionStyle: {
        scale: spring(
          (hover || externalHover) ? hoveredScale : defaultScale,
          { stiffness, damping: (hover || externalHover) ? hoveredDumping : damping, precision }
        ),
      },
      theme: {
        ...theme,
        marker: cx(
          theme.marker,
          {
            [theme.hover]: hover || externalHover,
            [theme.active]: active,
            [theme.isNew]: isNew,
          }
        ),
      },
    })
  )
);

export default compose(
  baseMarkerHOC,
  // optimization so not exposed as baseMarkerHOC
  // it's on child markers controls to optimize
  mapProps(props => (
    omitBy(props, (v, k) => k.startsWith('$'))
  )),
  pure
)(baseMarker);
