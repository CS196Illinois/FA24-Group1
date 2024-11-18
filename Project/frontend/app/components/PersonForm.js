import React, { useState } from 'react';
import styles from './PersonForm.module.css';

function PersonForm({ onPersonCreated }) {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (rest of the submit logic)
  };

  return (
    <form onSubmit={handleSubmit} className={styles['person-form']}>
      <div className={styles['form-group']}>
        <input 
          type="text" 
          value={name} 
          onChange={handleNameChange} 
          placeholder="Enter name" 
          className={styles['form-input']}
        />
      </div>
      <div className={styles['form-group']}>
        <label className={styles['file-input-label']}>
          Choose File
          <input 
            type="file" 
            onChange={handlePhotoChange} 
            accept="image/*" 
            className={styles['file-input']}
          />
        </label>
      </div>
      <button type="submit" className={styles['submit-button']}>Create Person</button>
    </form>
  );
}

export default PersonForm;