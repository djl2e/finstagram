import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ChangeProfilePic(props) {
  const [image, setImage] = useState(null);
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
      'form-user-image': image,
    }

    axios
      .post('/users/image', body, config)
      .then((res) => {
        navigate(`/users/${props.user._id}`);
      })
      .catch((err) => {
        setError(err.response.data.message);
      })
  }

  return (
    <form className="profile-pic-form" onSubmit={submitForm}>
      <p className="error-message" hidden={error ? false : true}>{error}</p>
      <p className="error-message" hidden={error ? false : true}>Please try again.</p>
      <label htmlFor="profile-pic-input">Submit empty for default profile picture.</label>
      <input type="file" accept="image/*" name="profile-pic-input" id="profile-pic-input" onChange={(e) => setImage(e.target.files[0])}/>
      <button type="submit">Update Photo</button>
      <Link to={`/users/${props.user._id}`}>Back to Profile</Link>
    </form>
  )

}

export default ChangeProfilePic;