import React, { useState } from "react";
import axios from 'axios';

function EditPost(props) {
  const [newCaption, setNewCaption] = useState(props.content);
  const [error, setError] = useState('');

  const { postId } = props;

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
        window.location.reload(false);
      })
      .catch((err) => {
        setError(err.response.data.message);
      })
  }

  return (
    <form className="edit-content" onSubmit={editCaption}>
      <p className="error-message" hidden={error ? false : true}>{error}</p>
      <p className="error-message" hidden={error ? false : true}>Please try again.</p>
      <input 
        type="text" 
        className="edit-caption" 
        required 
        value={newCaption}
        onChange={(e) => setNewCaption(e.target.value)}
      />
      <button type="submit" className="edit-caption-button">Edit</button>
      <input 
        type="button" 
        className="cancel-edit-caption" 
        value="Cancel"
        onClick={(e) => props.setEditing(false)}
      />
    </form>
  )
}

export default EditPost;
