import React from 'react';

import compose from 'recompose/compose';
import pure from 'recompose/pure';
import defaultProps from 'recompose/defaultProps';
import withProps from 'recompose/withProps';
import withPropsOnChange from 'recompose/withPropsOnChange';
import { themr } from 'react-css-themr';
import BaseMarker from './BaseMarker';
import tooltipMarkerStyles from './TooltipMarker.sass';

export const tooltipMarker = ({
  content,
  theme, tooltipPosition,
  tooltipContent, active, ...props,
  tooltipOffsetStyle,
}) => (
  <BaseMarker
    content={content}
    active={active}
    {...props}
    theme={theme}
    themeNamespace={'baseMarker'}
  >
    <div
      className={theme.tooltipOffsetHelper}
      style={tooltipOffsetStyle}
    >
      <div
        key={tooltipPosition /* key is hack to break prev css animation position, don't touch */}
        className={theme.tooltipHolder}
      >
        <div className={theme.tooltip}>
          <div className={theme.tooltipContent}>
            {tooltipContent}
          </div>
        </div>
      </div>
    </div>
  </BaseMarker>
);

const tooltipOffsetStyleDefault = {
  left: 0,
  top: 0,
};

export const tooltipMarkerHOC = compose(
  themr('tooltipMarker', tooltipMarkerStyles),
  defaultProps({
    paddingOffset: 75,
    ifOutsidePaddingX: 15,
    ifOutsidePaddingY: 5,
  }),
  pure,
  withProps(({ tooltipContentHeight, tooltipContentWidth, paddingOffset }) => ({
    yPadding: tooltipContentHeight + paddingOffset,
    xPadding: (tooltipContentWidth / 2) + paddingOffset,
  })),
  withProps(({ getTooltipContent, getTooltipContentArg, tooltipContent }) => ({
    tooltipContent: getTooltipContent
      ? getTooltipContent(getTooltipContentArg)
      : tooltipContent,
  })),
  // tooltip positioning logic, see position modifiers here http://istarkov.github.io/html-hint/
  withProps(
    ({
      xPadding, yPadding,
      ifOutsidePaddingX, ifOutsidePaddingY,
      $geoService, $getDimensions, $dimensionKey,
    }) => {
      const mapWidth = $geoService.getWidth();
      const mapHeight = $geoService.getHeight();
      const { x, y } = $getDimensions($dimensionKey);

      // calculate hint class, how to show marker at right position
      const xModifier = x < xPadding // eslint-disable-line
        ? '-right'
        : x > mapWidth - xPadding
          ? '-left'
          : '';

      const yModifier = y < yPadding
        ? 'bottom'
        : 'top';

      const tooltipPosition = `hint--${yModifier}${xModifier}`;

      // calculate tooltip offset if marker center is outside map
      // this is possible for svg polygons
      const tooltipOffsetX = -Math.min(0, x - ifOutsidePaddingX) -
        Math.max(x - mapWidth + ifOutsidePaddingX, 0);

      const tooltipOffsetY = -Math.min(0, y - ifOutsidePaddingY) -
        Math.max(y - mapHeight + ifOutsidePaddingY, 0);

      return {
        tooltipContentPosition: yModifier,
        tooltipPosition,
        tooltipOffsetStyle: tooltipOffsetY === 0 && tooltipOffsetX === 0
          ? tooltipOffsetStyleDefault
          : {
            top: tooltipOffsetY,
            left: tooltipOffsetX,
          },
      };
    }
  ),
  // combine styles
  withPropsOnChange(
    ['hover', 'tooltipPosition', 'theme'],
    ({ hover, tooltipPosition, theme }) => ({
      theme: {
        ...theme,
        tooltip: hover
          ? `${theme.tooltip} ${theme[tooltipPosition]} ` +
            `${theme.tooltipAlways}`
          : `${theme.tooltip} ${theme[tooltipPosition]} ` +
            `${theme.tooltipHidden}`,
      },
    })
  )
);

export default tooltipMarkerHOC(tooltipMarker);
