/* eslint-disable no-param-reassign */
import React from 'react';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import { themr } from 'react-css-themr';
import { susolvkaCoords, generateMarkers } from './utils/fakeData';
import CanvasHoverMap from './controls/Map';
import { HoveredTooltipMarker } from './controls/Markers';
import mapStyles from './map.sass';

const MARKERS_COUNT = 10000;

export const map = ({
  theme,
  style,
  options,
  markerHoverDistance,
  markers,
  renderMarkers,
  renderMarker,
  mapParams: {
    zoom,
    center,
  },
  onMapParamsChange,
}) => (
  <div className={theme.component}>
    <CanvasHoverMap
      // flex: 1 here
      style={style}
      // google map options https://developers.google.com/maps/documentation/javascript/controls#ControlOptions
      options={options}
      // see CanvasMap onMouseMove, distance at which algorithm decides that marker is hovered
      markerHoverDistance={markerHoverDistance}
      // google-map-react props
      center={center}
      zoom={zoom}
      onChange={onMapParamsChange}
      // canvas markers, and render functions
      markers={markers}
      // render markers at canvas
      renderMarkers={renderMarkers}
      // render hovered marker as is
      renderMarker={renderMarker}
      // to force redraw just pass a new empty object to refresh for example
      // refresh={selected}
    />
  </div>
);

export const mapHOC = compose(
  themr('map', mapStyles),
  defaultProps({
    options: {
      scrollwheel: true,
      zoomControl: true,
      zoomControlOptions: {
        position: 1, // google.maps.ControlPosition.LEFT_TOP
      },
      minZoom: 3,
      zoom: 10,
      maxZoom: 18,
      disableDoubleClickZoom: true,
    },
    style: {
      flex: 1,
    },
    hoverDistance: 15,
    markerHoverDistance: 15,
    markers: generateMarkers(MARKERS_COUNT, 0.0003),
  }),
  withState('mapParams', 'setMapParams', { center: susolvkaCoords, zoom: 6 }),
  withHandlers({
    onMapParamsChange: ({ setMapParams }) => ({ center, zoom, bounds }) => {
      setMapParams({ center, zoom, bounds });
    },
    renderMarker: ({ theme }) => marker => (
      <HoveredTooltipMarker
        /* key is needed to play initial anim in some cases */
        key={marker.id}
        theme={theme}
        themeNamespace={'tooltipMarker'}
        // active={fa}
        initialScale={1}
        defaultScale={1}
        hoveredScale={1.3}
        tooltipContent={(
          <div className={theme.tooltip}>
            <div className={theme.tooltipName}>
              Name of marker {marker.id}
            </div>
            <div className={theme.tooltipAddress}>
              Address of marker
            </div>
          </div>
        )}
        paddingOffset={60} // used for tooltip position
        tooltipContentHeight={10} // no need to be exact, used for tooltip position
        tooltipContentWidth={100} // no need to be exact, used for tooltip position
        {...marker}
      />
    ),
    // be sure in current implementation markers is tile markers, not all markers.
    // tiling is used as it allows some perf optimizations not used here
    renderMarkers: () => ({ ctx, markers, tileSize }) => {
      ctx.clearRect(0, 0, tileSize, tileSize);
      const radius = 5;
      markers.forEach(({ /* id, */ x, y }) => {
        // just circles here but can be images, use id or other marker props to render
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.arc(x, y, radius + 3, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, radius + 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#00b92a';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
      });
    },
  }),
);

export default mapHOC(map);
