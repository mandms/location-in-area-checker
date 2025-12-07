import {MapContainer, Marker, Polygon, TileLayer, Tooltip, useMapEvents} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import type {TPoint} from "../../types.ts";
import styles from "./Map.module.scss"
import React, {useRef, useState} from "react";
import Alert from "../ui/Alert/Alert.tsx";
import validatePoint from "../../utils/validatePoint.ts";


export interface MapComponentProps {
  point: TPoint | undefined;
  polygon: TPoint[];
  setPolygon: (newPolygon: TPoint[]) => void;
  addPointToPolygon: (newPoint: TPoint) => void;
}

interface AddPointInPolygonProps {
  addPointToPolygon: (newPoint: TPoint) => void;
  polygon: TPoint[];
  setAlert: (message: string) => void;
}

const AddPointInPolygon: React.FC<AddPointInPolygonProps> = ({addPointToPolygon, polygon, setAlert}) => {
  useMapEvents({
    click(e) {
      const {lat, lng} = e.latlng;

      const validation = validatePoint({lat, lng}, polygon)

      if (!validation.isValid) {
        setAlert(validation.message || '')
        return;
      }

      addPointToPolygon({lat, lng});
    },
  });

  return null;
}


const Map: React.FC<MapComponentProps> = ({point, setPolygon, polygon, addPointToPolygon}) => {
  const [isShowAlert, setIsShowAlert] = useState<{ message: string, condition: boolean }>({message: "", condition: false});

  const handleSetAlert = (message: string) => {
    setIsShowAlert({message, condition: !isShowAlert.condition});
  }

  const handleClose = () => {
    setIsShowAlert(prev => ({...prev, condition: false}));
  }

  const markerRefs = useRef<(L.Marker | null)[]>([]);

  const createEventHandlers = (pointId: number) => {

    const updatePolygonPoint = (marker: L.Marker) => {
      const point = marker.getLatLng();
      const updatedPoint: TPoint = {lat: point.lat, lng: point.lng};

      const validation = validatePoint(point, polygon, pointId);

      if (!validation.isValid) {
        setIsShowAlert({message: validation.message || "", condition: !isShowAlert.condition})
        const oldPoint = polygon.find((_, id) => id === pointId);
        marker.setLatLng(oldPoint!)
        setPolygon([...polygon])
        return;
      }

      const newPoints = polygon.map((point, id) => {
        if (id === pointId) {
          return updatedPoint;
        }
        return point;
      });

      setPolygon(newPoints);
    }


    return {
      dragend() {
        const marker = markerRefs.current[pointId];
        if (marker != null) {
          updatePolygonPoint(marker);
        }
      },
    };
  };


  return (
    <>
      <MapContainer attributionControl={false} className={styles.map} center={[56.63, 47.89]} zoom={13}>
        <TileLayer
          attribution=''
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddPointInPolygon addPointToPolygon={addPointToPolygon} polygon={polygon} setAlert={handleSetAlert}/>
        {point && <Marker position={point}></Marker>}
        {polygon.length > 0 && polygon.map((point, idx) => (
          <Marker draggable eventHandlers={createEventHandlers(idx)} ref={ref => { markerRefs.current[idx] = ref }} key={`${point.lng}-${point.lat}`} position={point}>
            <Tooltip direction="top" offset={[0, 20]} opacity={1} permanent>{idx + 1}</Tooltip>
          </Marker>
        ))}
        {polygon.length > 0 && <Polygon pathOptions={{color: 'blue'}} positions={polygon}/>}
      </MapContainer>
      {isShowAlert.condition &&
          <Alert overlay={true} onClose={handleClose} variant="warning" message={isShowAlert.message} title="Ошибка"/>}
    </>
  );
}

export default Map;