import {MapContainer, Marker, Polygon, TileLayer, Tooltip, useMapEvents} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import type {TPoint} from "../../types.ts";
import getPolygonIntersection from "../../utils/checkIntersection.ts";
import styles from "./Map.module.scss"
import React, {useState} from "react";
import Alert from "../ui/Alert/Alert.tsx";


export interface MapComponentProps {
  point: TPoint | undefined;
  polygon: TPoint[];
  setPolygon: (newPoint: TPoint) => void;
}

interface AddPointInPolygonProps {
  setPolygon: (newPoint: TPoint) => void;
  polygon: TPoint[];
  setAlert: (message: string) => void;
}

const AddPointInPolygon: React.FC<AddPointInPolygonProps> = ({setPolygon, polygon, setAlert}) => {
  useMapEvents({
    click(e) {
      const {lat, lng} = e.latlng;

      const existingPoint = polygon.find(value => value.lat === lat && value.lng === lng)

      if (existingPoint) {
        setAlert("Нельзя потсавить точку т.к. там уже есть точка");
        return null;
      }

      if (getPolygonIntersection({lat, lng}, polygon)) {
        setAlert("Нельзя потсавить точку т.к. она пересекается с гранью");
        return null;
      }

      setPolygon({lat, lng});
    },
  });

  return null;
}

const Map: React.FC<MapComponentProps> = ({point, setPolygon, polygon}) => {
  const [alert, setAlert] = useState<{ message: string, condition: boolean }>({message: "", condition: false});

  const handleSetAlert = (message: string) => {
    setAlert({message, condition: !alert.condition});
  }

  const handleClose = () => {
    setAlert(prev => ({...prev, condition: false}));
  }

  return (
    <>
      <MapContainer attributionControl={false} className={styles.map} center={[56.63, 47.89]} zoom={13}>
        <TileLayer
          attribution=''
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AddPointInPolygon setPolygon={setPolygon} polygon={polygon} setAlert={handleSetAlert}/>
        {point && <Marker position={point}></Marker>}
        {polygon.length > 0 && polygon.map((point, idx) => (
          <Marker draggable key={`${point.lng}-${point.lat}`} position={point}>
            <Tooltip direction="top" offset={[0, 20]} opacity={1} permanent>{idx + 1}</Tooltip>
          </Marker>
        ))}
        {polygon.length > 0 && <Polygon pathOptions={{color: 'blue'}} positions={polygon}/>}
      </MapContainer>
      {alert.condition &&
          <Alert overlay={true} onClose={handleClose} variant="warning" message={alert.message} title="Ошибка"/>}
    </>
  );
}

export default Map;