"use client";

import React, { useEffect, useState } from 'react';
import styles from './ViewPerson.module.css';

const ViewPerson = () => {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/people', { credentials: 'include' })
      .then(response => response.json())
      .then(data => setPeople(data))
      .catch(error => console.error('Error fetching people:', error));
  }, []);

  const handlePersonClick = (person) => {
    if (selectedPerson && selectedPerson._id === person._id) {
      setSelectedPerson(null); // Hide memories if the same person is clicked again
    } else {
      setSelectedPerson(person); // Show memories of the clicked person
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>People Archive</h1>
      <div className={styles.content}>
        <div className={styles.peopleGrid}>
          {Array.isArray(people) && people.length > 0 ? (
            people.map(person => (
              <div 
                key={person._id} 
                className={`${styles.personCard} ${selectedPerson && selectedPerson._id === person._id ? styles.selected : ''}`}
                onClick={() => handlePersonClick(person)}
              >
                <img src={person.profilePicture} alt={person.name} className={styles.profilePicture} />
                <h2>{person.name}</h2>
              </div>
            ))
          ) : (
            <p>No people available</p>
          )}
        </div>
        {selectedPerson && (
          <div className={styles.memoryArchive}>
            <h2>{selectedPerson.name}'s Archive</h2>
            <div className={styles.memoryColumn}>
              {selectedPerson.memories && selectedPerson.memories.length > 0 ? (
                selectedPerson.memories.map(memory => (
                  <div key={memory._id} className={styles.memoryCard}>
                    <img src={memory.photo} alt={memory.title} className={styles.memoryPhoto} />
                    <h3>{memory.title}</h3>
                    <p>{memory.comments[0]?.text}</p>
                  </div>
                ))
              ) : (
                <p>No memories available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPerson;