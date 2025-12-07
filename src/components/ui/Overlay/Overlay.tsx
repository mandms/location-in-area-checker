import React from 'react';
import styles from "./Overlay.module.scss"

interface OverlayProps {
  children: React.ReactNode
  show: boolean
}

const Overlay: React.FC<OverlayProps> = ({children, show}) => {
  return (
    <>
      {show && <div className={styles.overlay}></div>}
      {children}
    </>
  )
}

export default Overlay;