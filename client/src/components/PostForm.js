import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostForm() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function submitForm(e) {
    e.preventDefault();
    const config = {
      headers: { 
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    const body = {
      'form-image': image,
      'form-caption': caption,
    }

    axios
      .post('/posts/create', body, config)
      .then((res) => {
        navigate('../users/profile');
      })
      .catch((err) => {
        setError(err.response.data.message);
      })
  }

  return (
    <form action="/posts/create" className="new-post-form" onSubmit={submitForm}>
      <p className="error-message" hidden={error ? false : true}>{error}</p>
      <p className="error-message" hidden={error ? false : true}>Please try again.</p>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required/>
      <input type="text" placeholder="Caption" onChange={(e) => setCaption(e.target.value)}/>
      <button type="submit">Create Post</button>
    </form>
  )

}

export default PostForm;
