import React, { useState } from "react";
import axios from 'axios';

function EditPost(props) {
  const [newCaption, setNewCaption] = useState(props.post.caption);

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
      .post(`/api/posts/${postId}/update`, body, config)
      .then((res) => {
        const newPost = {...post}
        newPost.caption = newCaption;
        setPost(newPost);
        setEditing(false);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <form className="edit-content" onSubmit={editCaption}>
      <textarea 
        rows="2" cols="25"
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
