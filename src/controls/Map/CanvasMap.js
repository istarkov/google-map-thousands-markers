import React from 'react';
import uniqBy from 'lodash/uniqBy';
import minBy from 'lodash/minBy';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import withHandlers from 'recompose/withHandlers';
import withPropsOnChange from 'recompose/withPropsOnChange';
import withState from 'recompose/withState';
import GoogleMapReact from 'google-map-react';
import {
  vecAdd, vecMul, distance, tile2LatLng, latLng2Scaled, getTilesIds, getTileBounds,
} from './utils';
import { unstable_batchedUpdates as reactUpdate } from 'react-dom'; // eslint-disable-line
import CanvasTile from './CanvasTile';

const TILE_SIZE = 256;
const mapStyle = {
  flex: 1,
  display: 'flex',
  cursor: 'pointer',
};

export const canvasMap = ({
  children,
  tiles,
  onMouseMove,
  renderMarkers,
  ...props,
}) => (
  <div onMouseMove={onMouseMove} style={mapStyle}>
    <GoogleMapReact
      {...props}
    >
      {
        tiles.map(tile => (
          <CanvasTile
            key={`${tile.x} ${tile.y}`}
            zoom={props.zoom}
            renderMarkers={renderMarkers}
            {...tile}
          />
        ))
      }
      {children}
    </GoogleMapReact>
  </div>
);

export const canvasMapHOC = compose(
  defaultProps({
    bboxSize: 40,
    markerHoverDistance: 30,
    onMarkerMouseEnter: () => {},
    onMarkerMouseLeave: () => {},
    onDrag: () => {},
    markers: [],
  }),
  withState('mapData', 'setMapData', {}),
  withHandlers(() => {
    let boundingRect_;
    let hoveredMarker_;
    let lastDragTime_ = 0;

    return {
      onMouseMove: ({
        mapData: { bounds, zoom },
        markers,
        markerHoverDistance,
        onMarkerMouseEnter,
        onMarkerMouseLeave,
      }) => (e) => {
        // highly unoptimized distance checker
        if (!bounds) return;
        // can be debounced to reduce calculations
        boundingRect_ = boundingRect_ || e.currentTarget.getBoundingClientRect();
        const currTime = (new Date()).getTime();

        const NO_HOVER_AFTER_DRAG_TIMEOUT = 100; // to prevent hovers at drag

        if (currTime - lastDragTime_ < NO_HOVER_AFTER_DRAG_TIMEOUT) {
          if (hoveredMarker_) {
            onMarkerMouseLeave(hoveredMarker_);
          }
          hoveredMarker_ = undefined;
          lastDragTime_ = currTime;
          return;
        }

        if (markers.length === 0) {
          if (hoveredMarker_) {
            onMarkerMouseLeave(hoveredMarker_);
          }
          hoveredMarker_ = undefined;
          return;
        }

        const mousePos = {
          x: e.clientX - boundingRect_.left,
          y: e.clientY - boundingRect_.top,
        };
        // convert 2 tile coords
        const ptNW = latLng2Scaled(bounds.nw, zoom);
        const mpt = vecAdd(ptNW, vecMul(mousePos, 1 / TILE_SIZE));
        const mptLatLng = tile2LatLng(mpt, zoom);

        // find nearest check that it inside distance
        const nearestMarker = minBy(
          markers,
          ({ lat, lng }) => Math.pow(mptLatLng.lat - lat, 2) + Math.pow(mptLatLng.lng - lng, 2)
        );

        // distance in pixels
        const dist = distance(latLng2Scaled(nearestMarker, zoom), mpt) * TILE_SIZE;

        if (dist < markerHoverDistance) {
          if (hoveredMarker_ !== nearestMarker) {
            if (hoveredMarker_) {
              onMarkerMouseLeave(hoveredMarker_);
            }

            hoveredMarker_ = nearestMarker;

            onMarkerMouseEnter(nearestMarker);
          }
        } else {
          if (hoveredMarker_) {
            onMarkerMouseLeave(hoveredMarker_);
          }
          hoveredMarker_ = undefined;
        }
      },
      onChange: ({ onChange, setMapData, tileExpand = 2 }) => (mapProps, ...args) => {
        reactUpdate(() => {
          onChange(mapProps, ...args);
          const { bounds, zoom } = mapProps;
          const ids = getTilesIds({ bounds, zoom, tileExpand });
          const tileBounds = getTileBounds({ bounds, zoom, tileExpand });
          setMapData({ ids, tileBounds, bounds, zoom });
        });
      },
      onDrag: ({ onDrag }) => (...args) => {
        lastDragTime_ = (new Date()).getTime();
        onDrag(...args);
      },
    };
  }),
  withPropsOnChange(
    ['markers', 'mapData', 'bboxSize', 'refresh'],
    ({ markers, mapData: { zoom, tileBounds }, bboxSize = 40 }) => {
      if (!tileBounds) {
        return {
          tiles: [],
        };
      }

      const [from, to] = tileBounds;
      const bigN = Math.pow(2, 26);
      const tiles = {};

      markers.forEach((m) => {
        const pt = latLng2Scaled(m, zoom);
        const bb = bboxSize / 2 / TILE_SIZE;

        const allPts = [
          pt,
          vecAdd(pt, { x: -bb, y: bb }),
          vecAdd(pt, { x: bb, y: bb }),
          vecAdd(pt, { x: bb, y: -bb }),
          vecAdd(pt, { x: -bb, y: -bb }),
        ];

        const uniqTiles = uniqBy(
          allPts.map(({ x, y }) => ({ x: Math.floor(x), y: Math.floor(y) })),
          ({ x, y }) => x * bigN + y,
        ).filter(({ x, y }) => from.x <= x && x <= to.x && from.y <= y && y <= to.y);

        uniqTiles.forEach(({ x, y }) => {
          const key = `${x} ${y}`;
          if (!tiles[key]) {
            tiles[key] = {
              ...tile2LatLng({ x, y }, zoom),
              x,
              y,
              markers: [],
            };
          }
          tiles[key].markers.push(m);
        });
      });

      return {
        tiles: Object.values(tiles),
      };
    },
  ),
);

export default canvasMapHOC(canvasMap);
