import * as React from "react";
import {useState} from "react";
import type {TPoint} from "../../types.ts";
import {isPointInPolygon} from "../../utils/isPointInPolygon.ts";
import AddressInput from "../AddressInput/AddressInput.tsx";
import Map from "../Map/Map.tsx";
import styles from "./LocationInAreaChecker.module.scss";
import Alert from "../ui/Alert/Alert.tsx";
import {Button} from "../ui/Button/Button.tsx";

const LocationInAreaChecker: React.FC = () => {
  const [point, setPoint] = useState<TPoint>();
  const [polygon, setPolygon] = useState<TPoint[]>([]);
  const [alert, setAlert] = useState(false);
  const [insidePolygon, setInsidePolygon] = useState(false);

  const handleCheckPolygonClick = () => {
    const isInPolygon = point ? isPointInPolygon(polygon, point) : false;
    setInsidePolygon(isInPolygon);
    setAlert(true)
  }

  const handleSetPolygon = (newPoint: TPoint) => {
    setPolygon(prevPoints => [...prevPoints, newPoint]);
  }

  const handleAlertClose = () => {
    setAlert(false);
  }

  const onPolygonDelete = () => {
    setPolygon([])
  }

  return (
    <div className={styles.pageContainer}>
      {alert && <Alert overlay title="Проверка адреса" message={insidePolygon ? 'Точка внутри полигона' : 'Точка снаружи полигона'} onClose={handleAlertClose} />}
      <AddressInput 
        setPoint={setPoint} 
        point={point}
        polygon={polygon}
        onCheck={handleCheckPolygonClick}
      />
      <div className={styles.sideBar}>
        <Button variant="danger" onClick={onPolygonDelete} >Удалить полигон</Button>
      </div>
      <Map point={point} polygon={polygon} setPolygon={handleSetPolygon}/>
    </div>
  )
};

export default LocationInAreaChecker;