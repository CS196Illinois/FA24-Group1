"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import userImg from '../public/addUser.png';
import styles from './friends.module.css';

const PersonIcon = ({ person, onDelete }) => {
  return (
    <div className={styles.userIcon}>
      <div className={styles.imageContainer}>
        {person.profilePicture ? (
          <img
            src={`http://localhost:3000${person.profilePicture.replace('http://localhost:3000', '')}`}
            alt={person.name}
            width={100}
            height={100}
            className={styles.userPicture}
          />
        ) : (
          <div className={styles.placeholderImage}>
            {person.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <p>{person.name}</p>
      <Link href={`/edit/${person._id}`}>
        <button className={styles.editButton}>Edit Person</button>
      </Link>
      <button className={styles.deleteButton} onClick={() => onDelete(person._id)}>Delete Person</button>
    </div>
  );
};


const App = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/people', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch people');
      }

      const data = await response.json();
      setPeople(data);
    } catch (error) {
      console.error('Error fetching people:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (personId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/people/${personId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setPeople(people.filter(person => person._id !== personId));
      } else {
        throw new Error('Failed to delete person');
      }
    } catch (error) {
      console.error('Error deleting person:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.background}>
      <div className={styles.app}>
        <div className={styles.iconGrid}>
          {people.map((person) => (
            <PersonIcon key={person._id} person={person} onDelete={handleDelete} />
          ))}
          <div className={styles.addIcon}>
            <Link href="/createUser" className={styles.item}>
              <div className={styles.imageContainer}>
                <Image src={userImg} alt="Add User" className={styles.addIconPic} />
              </div>
              <p className={styles.text}>Add User</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;