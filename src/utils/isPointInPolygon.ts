import type {TPoint} from "../types.ts";

export function isPointInPolygon(polygon: TPoint[], point: TPoint) {
  let inside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;

    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect = ((yi > point.lat) !== (yj > point.lat)) &&
      (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}