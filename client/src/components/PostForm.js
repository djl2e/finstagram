import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/PostInfo.css';

function PostForm() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const imgSrc = 'https://finstagram-images.s3.us-east-1.amazonaws.com/';

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
      .post('/api/posts/create', body, config)
      .then((res) => {
        navigate('../users/profile');
      })
      .catch((err) => {
        setError(err.response.data.message);
      })
  }

  return (
    <div className="new-post-page main">
      <form action="/posts/create" className="new-post-form" onSubmit={submitForm}>
        <img id="image-gallery" src={imgSrc + 'image-gallery.png'} alt="new post" />
        <p id="image-gallery-caption">
          { image == null ? "Upload photos here!" : "Image selected!" }
        </p>
        <label htmlFor="img-upload" className="img-upload-container">
          Select from computer
        </label> 
        <input type="file" accept="image/*" id="img-upload" onChange={(e) => setImage(e.target.files[0])} required/>
        <div className="error-container">
          <p className="error-message" hidden={error ? false : true}>{error} Please try again.</p>
        </div>
        <textarea rows="4" cols="40" placeholder="Add caption" onChange={(e) => setCaption(e.target.value)}/>
        <button type="submit">Create Post</button>
      </form>
    </div>
  )

}

export default PostForm;
