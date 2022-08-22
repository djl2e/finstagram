import React, { useState } from "react";
import axios from 'axios';

function EditPost(props) {
  const [newCaption, setNewCaption] = useState(props.content);
  const [error, setError] = useState('');

  const { postId, post, setPost, setEditing } = props;

  function editCaption(e) {
    e.preventDefault();
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    const body = {
      'form-caption': newCaption
    }
    axios
      .post(`/posts/${postId}/update`, body, config)
      .then((res) => {
        const newPost = {...post}
        newPost.caption = newCaption;
        setPost(newPost);
        setEditing(false);
      })
      .catch((err) => {
        setError(err.response.data.message);
      })
  }

  return (
    <form className="edit-content" onSubmit={editCaption}>
      <p className="error-message" hidden={error ? false : true}>{error}</p>
      <p className="error-message" hidden={error ? false : true}>Please try again.</p>
      <textarea 
        rows="2" cols="20"
        className="edit-caption" 
        required 
        value={newCaption}
        onChange={(e) => setNewCaption(e.target.value)}
      />
      <div className="edit-content-buttons">
        <button type="submit" className="edit-caption-button">Edit</button>
        <input 
          type="button" 
          className="cancel-edit-caption" 
          value="Cancel"
          onClick={(e) => setEditing(false)}
        />
      </div>
    </form>
  )
}

export default EditPost;
