import React from 'react';
import styles from "./Alert.module.scss"
import {Button} from "../Button/Button.tsx";
import Overlay from "../Overlay/Overlay.tsx";

export type AlertVariant = 'success' | 'info' | 'danger' | 'warning';

interface AlertProps {
  variant?: AlertVariant;
  title: string;
  message: string;
  overlay?: boolean;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({variant = "info", title, message, onClose, overlay = false}) => {

  const classNames = [
    styles[variant],
    styles.alert
  ].join(' ');

  return (
    <Overlay show={overlay}>
      <div className={classNames}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.message}>{message}</p>
        <Button variant="danger" onClick={onClose}>Закрыть</Button>
      </div>
    </Overlay>
  )
};

export default Alert;