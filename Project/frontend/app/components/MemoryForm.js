'use client'

import React, { useState } from 'react';

function MemoryForm({ personId, addMemory }) {
  const [description, setDescription] = useState('');

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const response = await fetch('http://localhost:3000/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            userID: personId, 
            description, 
            title: '', // Add a title field to your form if needed
            isPhoto: false, // Adjust based on your requirements
            tags: [], // Add a tags field to your form if needed
            accessLevel: '0' // Add an accessLevel field to your form if needed
        }),
        });
      const data = await response.json();
      addMemory(data);
      setDescription(''); // Clear the input after successful submission
    } catch (error) {
      console.error('Error creating memory:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Enter memory description"
        required
      />
      <button type="submit">Add Memory</button>
    </form>
  );
}

export default MemoryForm;