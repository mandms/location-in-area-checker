import type {TPoint} from "../types.ts";

function getIntersection(A: TPoint, B: TPoint, C: TPoint, D: TPoint) {
  const x1 = A.lat, y1 = A.lng;
  const x2 = B.lat, y2 = B.lng;
  const x3 = C.lat, y3 = C.lng;
  const x4 = D.lat, y4 = D.lng;

  const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  if (den === 0) {
    return null;
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
  const u = -(((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den);

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return true;
  }

  return false;
}

function getPolygonIntersection(newPoint: TPoint, polygon: TPoint[]) {

  const n = polygon.length;

  if (n < 3)
  {
    return false;
  }

  const firstPoint = polygon[0];
  const lastPoint = polygon[n-1];

  for (let i = 0, j = n - 1; i < n; j = i++) {

    const A = polygon[i];
    const B = polygon[j];

    if (A !==  firstPoint && B !== firstPoint) {
      const intersectionPoint = getIntersection(A, B, firstPoint, newPoint);
      if (intersectionPoint) {
        return true;
      }
    }
  }


  for (let i = 0, j = n - 1; i < n; j = i++) {

    const A = polygon[i];
    const B = polygon[j];

    if (A !=  lastPoint && B != lastPoint) {
      const intersectionPoint = getIntersection(A, B, lastPoint, newPoint);
      if (intersectionPoint) {
        return true;
      }
    }
  }

  return false;
}


export default getPolygonIntersection;