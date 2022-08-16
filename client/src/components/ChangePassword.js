import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ChangePassword(props) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
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
      'form-password': password,
      'form-confirm': confirm,
    }
    axios
      .post('/users/password', body, config)
      .then((res) => {
        navigate(`/users/${props.user._id}`);
      })
      .catch((err) => {
        setError(err.response.data.message);
      })
  }

  return (
    <form className="password-form" onSubmit={submitForm}>
      <p className="signup-error" hidden={error ? false : true}>{error}</p>
      <p className="signup-error" hidden={error ? false : true}>Please try again.</p>
      <label htmlFor="change-password">Password</label>
      <input 
        name="change-password"
        id="change-password"
        type="password" 
        placeholder="Enter New Password"
        minLength="6" 
        required 
        onChange={(e) => setPassword(e.target.value)}
      />
      <label htmlFor="confirm-new-password">Confirm Password</label>
      <input 
        name="confirm-new-password"
        id="confirm-new-password"
        type="password" 
        placeholder="Confirm Password" 
        minLength="6" 
        required 
        onChange={(e) => setConfirm(e.target.value)}
      />
      <button type="submit">Update Info</button>
      <Link to={`/users/${props.user._id}`}>Back to Profile</Link>
    </form>
  )
}

export default ChangePassword;
