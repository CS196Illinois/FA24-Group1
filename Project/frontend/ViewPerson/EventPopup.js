import React from 'react';
import styles from './EventPopup.module.css';

const EventPopup = ({ event, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <h2>{event.title}</h2>
        <img src={event.image} alt={event.title} className={styles.popupImage} />
        <p>{event.description}</p>
        <button className={styles.button} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EventPopup;