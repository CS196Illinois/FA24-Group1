import React from 'react';

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }

  handleTextChange = (e) => {
    this.setState({ text: e.target.value });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/create-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          memoryId: this.props.memoryId, 
          text: this.state.text 
        }),
      });
      const data = await response.json();
      this.props.addComment(data);
      this.setState({ text: '' });
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="comment-form">
        <input
          type="text"
          value={this.state.text}
          onChange={this.handleTextChange}
          placeholder="Enter a comment"
          required
        />
        <button type="submit">Add Comment</button>
      </form>
    );
  }
}

export default CommentForm;