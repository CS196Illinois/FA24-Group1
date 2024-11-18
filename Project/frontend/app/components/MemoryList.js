'use client'

import React from 'react';
import MemoryForm from './MemoryForm';
import Memory from './Memory';

function MemoryList({ personId, addMemory, memories }) {
  return (
    <div className="memory-list">
      <h3>Memories</h3>
      <MemoryForm personId={personId} addMemory={addMemory} />
      {memories.map((memory, index) => (
        <Memory key={index} memory={memory} />
      ))}
    </div>
  );
}

export default MemoryList;