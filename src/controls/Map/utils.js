export const vecAdd = (v, a) => ({ x: v.x + a.x, y: v.y + a.y });
export const vecMul = (v, a) => ({ x: v.x * a, y: v.y * a });

export function latLng2World({ lat, lng }) {
  const sin = Math.sin(lat * Math.PI / 180);
  const x = (lng / 360 + 0.5);
  let y = (0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI);

  y = y < 0 // eslint-disable-line
    ? 0
    : y > 1
      ? 1
      : y;
  return { x, y };
}

export function tile2LatLng({ x, y }, zoom) {
  const n = Math.PI - 2 * Math.PI * y / Math.pow(2, zoom);

  return ({
    lat: (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))),
    lng: (x / Math.pow(2, zoom) * 360 - 180),
  });
}

export function latLng2Scaled({ lat, lng }, zoom) {
  const worldCoords = latLng2World({ lat, lng });
  const scale = Math.pow(2, zoom);

  return {
    x: worldCoords.x * scale,
    y: worldCoords.y * scale,
  };
}

export function latLng2Tile({ lat, lng }, zoom) {
  const { x, y } = latLng2Scaled({ lat, lng }, zoom);

  return {
    x: Math.floor(x),
    y: Math.floor(y),
  };
}

export function getTileBounds({ bounds, zoom, tileExpand = 0 }) {
  const { nw, se } = bounds;
  const from = vecAdd(latLng2Tile(nw, zoom), { x: -tileExpand, y: -tileExpand });
  const to = vecAdd(latLng2Tile(se, zoom), { x: tileExpand, y: tileExpand });
  return [from, to];
}

export function getTilesIds({ bounds, zoom, tileExpand }) {
  const [from, to] = getTileBounds({ bounds, zoom, tileExpand });
  const scale = Math.pow(2, zoom);
  const ids = [];

  for (let x = from.x; x !== (to.x + 1) % scale; x = (x + 1) % scale) {
    for (let y = from.y; y !== (to.y + 1) % scale; y = (y + 1) % scale) {
      ids.push({ zoom, x, y });
    }
  }

  return ids;
}

export function bboxIntersects(bbox1, bbox2) {
  const [{ x: x0, y: y0 }, { x: x1, y: y1 }] = bbox1;
  const [{ x: a0, y: b0 }, { x: a1, y: b1 }] = bbox2;

  return !((y1 < b0 || y0 > b1) && (x1 < a0 || x0 > a1));
}

export function distance({ x: x0, y: y0 }, { x: x1, y: y1 }) {
  return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
}
