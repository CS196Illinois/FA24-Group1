'use client'

import React, { useState } from 'react';
import CommentForm from './CommentForm';

function Memory({ memory }) {
  const [comments, setComments] = useState([]);

  const addComment = async (text) => {
    try {
      const response = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          memoryID: memory.id, 
          userID: '', // You'll need to pass the current user's ID
          text 
        }),
      });
      const data = await response.json();
      setComments(prevComments => [...prevComments, data]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  

  return (
    <div className="memory">
      <p>{memory.description}</p>
      <div className="comments">
        <h4>Comments</h4>
        {comments.map((comment, index) => (
          <p key={index}>{comment.text}</p>
        ))}
        <CommentForm memoryId={memory.id} addComment={addComment} />
      </div>
    </div>
  );
}

export default Memory;