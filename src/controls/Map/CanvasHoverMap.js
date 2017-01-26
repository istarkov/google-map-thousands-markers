import React from 'react';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import branch from 'recompose/branch';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import withState from 'recompose/withState';
import CanvasMap from './CanvasMap';

export const canvasHoverMap = ({
  hoveredMarkers,
  renderMarker,
  refresh,
  children,
  draggable,
  ...props,
}) => (
  <CanvasMap
    refresh={refresh}
    draggable={draggable}
    {...props}
  >
    {hoveredMarkers.map(m => renderMarker(m))}
    {children}
  </CanvasMap>
);

export const canvasHoverMapHOC = compose(
  defaultProps({
    bufferSize: 10,
  }),
  branch(
    ({ onHoveredMarkersChange }) => !onHoveredMarkersChange,
    withState('hoveredMarkers', 'onHoveredMarkersChange', []),
  ),
  withHandlers({
    onMarkerMouseEnter: ({ onHoveredMarkersChange, bufferSize }) => (marker) => {
      onHoveredMarkersChange(hoveredMarkers =>
        [
          ...hoveredMarkers.filter(m => m.id !== marker.id),
          { ...marker, hover: true }
        ].slice(-bufferSize)
      );
    },
    onMarkerMouseLeave: ({ onHoveredMarkersChange }) => () => {
      onHoveredMarkersChange(hoveredMarkers =>
        hoveredMarkers
          .map(m => ({ ...m, hover: false }))
      );
    },
  }),
  withProps(({ hoveredMarkers }) => ({
    // cursor styling for some google internal reasons works only if drag disabled
    draggable: !hoveredMarkers.find(({ hover }) => hover === true),
  }))
);

export default canvasHoverMapHOC(canvasHoverMap);
