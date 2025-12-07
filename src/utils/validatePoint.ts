import type {TPoint} from "../types.ts";
import getPolygonIntersection from "./checkIntersection.ts";

export interface IValidated {
  message?: string,
  isValid: boolean
}

const validatePoint = (point: TPoint, polygon: TPoint[], movedPointIndex?: number): IValidated => {
  const existingPoint = polygon.find((value, idx) =>
    value.lat === point.lat && value.lng === point.lng && idx !== movedPointIndex)

  if (polygon.length === 20 && !movedPointIndex)
  {
    return {message: "Нельзя поставить больше 20 точек", isValid: false}
  }

  if (existingPoint) {
    return {message: "Нельзя потсавить точку т.к. там уже есть точка", isValid: false}
  }

  if (getPolygonIntersection(point, polygon, movedPointIndex)) {
    return {message: "Нельзя потсавить точку т.к. грани будут пересекаться", isValid: false}
  }

  return {isValid: true}
}

export default validatePoint;