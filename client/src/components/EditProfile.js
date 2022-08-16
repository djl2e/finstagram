import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function EditProfile(props) {
  const { user } = props;

  const [fullname, setFullname] = useState(user.name);
  const [description, setDescription] = useState(user.description);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function submitForm(e) {
    e.preventDefault();
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    const body = {
      'form-name': fullname,
      'form-description': description,
    }
    axios
      .post('/users/update', body, config)
      .then((res) => {
          navigate(`/users/${user._id}`);
      })
      .catch((err) => {
        setError(err.response.data.message);
      })
  }

  return (
    <form className="user-update-form" onSubmit={submitForm}>
      <Link to="/users/image">Change Profile Picture</Link>
      <Link to="/users/password">Change Password</Link>
      <Link to="/users/delete">Delete User</Link>
      <p className="signup-error" hidden={error ? false : true}>{error}</p>
      <p className="signup-error" hidden={error ? false : true}>Please try again.</p>
      <label htmlFor="new-name">Full Name</label>
      <input 
        name="new-name"
        id="new-name"
        type="text" 
        placeholder="Enter Full Name" 
        value={fullname} 
        required
        onChange={(e) => setFullname(e.target.value)}
      />
      <label htmlFor="new-description">Description</label>
      <input 
        name="new-description"
        id="new-description"
        type="text" 
        placeholder="Enter Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Update Info</button>
      <Link to={`/users/${user._id}`}>Back to Profile</Link>
    </form>
  )
}

export default EditProfile;