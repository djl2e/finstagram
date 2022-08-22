import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function RemovePost(props) {
  const navigate = useNavigate();

  const { postId, mainUserId, setEditing } = props;

  function submitDelete(e) {
    e.preventDefault();
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    axios
      .post(`/posts/${postId}/delete`, {}, config)
      .then((res) => {
        navigate(`/users/${mainUserId}`);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <form className="remove-post-form" onSubmit={submitDelete}>
      <div className="delete-options">
        <button type="submit"> Confirm Delete</button>
        <input 
          type="button" 
          className="cancel-delete-post" 
          value="Cancel"
          onClick={(e) => setEditing(false)}
        />
      </div>
    </form>
  )
}

export default RemovePost;
