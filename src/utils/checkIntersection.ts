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

  if (t > 0 && t < 1 && u > 0 && u < 1) {
    return true;
  }


  return false;
}

function getPolygonIntersection(newPoint: TPoint, polygon: TPoint[], movedPointIndex?: number) {

  const n = polygon.length;

  if (n < 3)
  {
    return false;
  }

  if (movedPointIndex !== undefined) {
    const prevIndex = movedPointIndex === 0 ? n - 1 : movedPointIndex - 1;
    const nextIndex = movedPointIndex === n - 1 ? 0 : movedPointIndex + 1;

    const prevPoint = polygon[prevIndex];
    const nextPoint = polygon[nextIndex];

    const newPoint1Start = prevPoint;
    const newPoint1End = newPoint;
    const newPoint2Start = newPoint;
    const newPoint2End = nextPoint;

    for (let i = 0, j = n - 1; i < n; j = i++) {
      const A = polygon[i];
      const B = polygon[j];

      if (i === movedPointIndex || j === movedPointIndex) {
        continue;
      }

      if (getIntersection(A, B, newPoint1Start, newPoint1End)) {
        return true;
      }

      if (getIntersection(A, B, newPoint2Start, newPoint2End)) {
        return true;
      }
    }

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