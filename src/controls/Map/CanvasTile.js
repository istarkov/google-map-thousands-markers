/* eslint-disable no-param-reassign */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import defaultProps from 'recompose/defaultProps';
import shouldUpdate from 'recompose/shouldUpdate';
import withProps from 'recompose/withProps';
import pure from 'recompose/pure';
import { latLng2Scaled } from './utils';

const TILE_SIZE = 256;

const canvasStyle = {
  width: '100%',
  height: '100%',
};

export const canvasTile = ({ registerChild, devicePixelRatio }) => (
  <canvas
    width={devicePixelRatio * TILE_SIZE}
    height={devicePixelRatio * TILE_SIZE}
    style={canvasStyle}
    ref={registerChild}
  />
);

export const canvasTileHOC = compose(
  defaultProps({
    x: 0,
    y: 0,
    zoom: 0,
    markers: [/* { lat: 60.814305, lng: 47.051773 } */],
    renderMarkers({ ctx, markers, tileSize }) {
      ctx.clearRect(0, 0, tileSize, tileSize);

      const radius = 5;

      markers.forEach(({ x, y }) => {
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
    devicePixelRatio: typeof window !== 'undefined' && window.devicePixelRatio || 1,
  }),
  pure,
  withHandlers(() => {
    let ctx_;

    const renderMarkers_ = ({ renderMarkers, markers, x, y, zoom }) => {
      renderMarkers({
        ctx: ctx_,
        markers: markers.map((m) => {
          const ptT = latLng2Scaled(m, zoom);
          const pt = {
            x: (ptT.x - x) * TILE_SIZE,
            y: (ptT.y - y) * TILE_SIZE,
          };
          return ({ ...m, ...pt });
        }),
        tileSize: TILE_SIZE,
      });
    };

    return {
      registerChild: ({
        devicePixelRatio,
        renderMarkers,
        markers,
        x,
        y,
        zoom,
      }) => (ref) => {
        ctx_ = ref && ref.getContext('2d');

        if (ctx_) {
          ctx_.scale(devicePixelRatio, devicePixelRatio);

          renderMarkers_({
            renderMarkers,
            markers,
            x,
            y,
            zoom,
          });
        }
      },
      renderMarkers: ({
        renderMarkers,
        markers,
        x,
        y,
        zoom,
      }) => () => {
        if (ctx_) {
          renderMarkers_({
            renderMarkers,
            markers,
            x,
            y,
            zoom,
          });
        }
      },
    };
  }),
  withProps(({ renderMarkers }) => {
    renderMarkers();
  }),
  shouldUpdate(() => false),
);

export default canvasTileHOC(canvasTile);
