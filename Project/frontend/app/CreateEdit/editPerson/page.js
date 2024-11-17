"use client";

import React, { useState, useEffect } from 'react';
import styles from './edit-person.module.css';

const EditPersonPage = () => {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [memoryTitle, setMemoryTitle] = useState('');
  const [memoryComment, setMemoryComment] = useState('');
  const [memory, setMemory] = useState(null);
  const [memoryPreview, setMemoryPreview] = useState(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/people', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch people');
      }
      const data = await response.json();
      setPeople(data);
    } catch (error) {
      console.error('Error fetching people:', error);
    }
  };

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
    setShowPopup(true);
  };

  const handleMemoryChange = (e) => {
    const file = e.target.files[0];
    setMemory(file);
    setMemoryPreview(URL.createObjectURL(file));
  };

  const handleMemorySubmit = async (e) => {
    e.preventDefault();
    if (!memory || !selectedPerson || !memoryTitle) return;

    const formData = new FormData();
    formData.append('photo', memory);
    formData.append('title', memoryTitle);
    formData.append('comment', memoryComment);

    try {
      const response = await fetch(`http://localhost:3000/api/people/${selectedPerson._id}/memories`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add memory');
      }

      const updatedPerson = await response.json();
      setPeople(people.map(person => person._id === updatedPerson._id ? updatedPerson : person));
      setSelectedPerson(updatedPerson);
      setMemory(null);
      setMemoryPreview(null);
      setMemoryTitle('');
      setMemoryComment('');
    } catch (error) {
      console.error('Error adding memory:', error);
    }
  };

  const handleDeleteMemory = async (personId, memoryId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/people/${personId}/memories/${memoryId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete memory');
      }

      const updatedPerson = await response.json();
      setPeople(people.map(person => person._id === updatedPerson._id ? updatedPerson : person));
      setSelectedPerson(updatedPerson);
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const handleAddComment = async (personId, memoryId, commentText) => {
    try {
      const response = await fetch(`http://localhost:3000/api/people/${personId}/memories/${memoryId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text: commentText }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const updatedMemory = await response.json();
      const updatedPerson = {
        ...selectedPerson,
        memories: selectedPerson.memories.map(memory => 
          memory._id === updatedMemory._id ? updatedMemory : memory
        ),
      };
      setPeople(people.map(person => person._id === updatedPerson._id ? updatedPerson : person));
      setSelectedPerson(updatedPerson);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        {Array.isArray(people) && people.length > 0 ? (
        people.map(person => (
            <div key={person._id} className={styles.profileWrapper} onClick={() => handlePersonClick(person)}>
            <div className={styles.imageContainer}>
                {person.profilePicture ? (
                <img 
                    src={person.profilePicture} 
                    alt={person.name} 
                    className={styles.profilePicture}
                />
                ) : (
                <div className={styles.placeholderImage}>
                    {person.name.charAt(0).toUpperCase()}
                </div>
                )}
            </div>
            <p className={styles.personName}>{person.name}</p>
            </div>
        ))
        ) : (
        <p>No people available</p>
        )}
      </div>

      {showPopup && selectedPerson && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>{selectedPerson.name}</h2>
            <div className={styles.memoryUploadContainer}>
              <div 
                className={styles.uploadBox} 
                onClick={() => document.getElementById('memoryUpload').click()}
              >
                {memoryPreview ? (
                  <img src={memoryPreview} alt="Memory preview" className={styles.memoryPreview} />
                ) : (
                  <p>Click to upload a photo</p>
                )}
              </div>
              <input
                id="memoryUpload"
                type="file"
                onChange={handleMemoryChange}
                accept="image/*"
                className={styles.hiddenFileInput}
              />
            </div>
            <input
              type="text"
              value={memoryTitle}
              onChange={(e) => setMemoryTitle(e.target.value)}
              placeholder="Enter memory title"
              className={styles.memoryTitleInput}
            />
            <textarea
              value={memoryComment}
              onChange={(e) => setMemoryComment(e.target.value)}
              placeholder="Enter memory comment"
              className={styles.memoryCommentInput}
            />
            <button onClick={handleMemorySubmit} className={styles.submitButton}>
              Submit Memory
            </button>
            <div className={styles.memoriesContainer}>
              <h3>Saved Memories</h3>
              {selectedPerson.memories.map((memory, index) => (
                <div key={memory._id} className={styles.memoryItem}>
                  <h4>Memory #{index + 1}: {memory.title}</h4>
                  <img src={memory.photo} alt={memory.title} className={styles.memoryPhoto} />
                  {memory.comments.map((comment, commentIndex) => (
                    <p key={commentIndex}>{comment.text}</p>
                  ))}
                  <input
                    type="text"
                    placeholder="Add a comment"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(selectedPerson._id, memory._id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button onClick={() => handleDeleteMemory(selectedPerson._id, memory._id)}>
                    Delete Memory
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPopup(false)} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPersonPage;