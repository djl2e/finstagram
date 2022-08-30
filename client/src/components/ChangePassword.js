import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/PostInfo.css';
import '../style/Account.css';

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
      .post('/api/users/password', body, config)
      .then((res) => {
        navigate(`/users/${props.user._id}`);
      })
      .catch((err) => {
        setError(err.response.data.message);
      })
  }

  return (
    <div className="password-page main">
      <form className="password-form" onSubmit={submitForm}>
      <div className="error-container">
          <p className="error-message" hidden={error ? false : true}>{error} Please try again.</p>
        </div>
        <div className="change-password-container">
          <label htmlFor="change-password">Password:</label>
          <input 
            name="change-password"
            id="change-password"
            type="password" 
            placeholder="Enter New Password"
            minLength="6" 
            required 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="confirm-new-password-container">
          <label htmlFor="confirm-new-password">Confirm Password:</label>
          <input 
            name="confirm-new-password"
            id="confirm-new-password"
            type="password" 
            placeholder="Confirm Password" 
            minLength="6" 
            required 
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <button type="submit">Update Info</button>
        <Link to={`/users/${props.user._id}`}>Back to Profile</Link>
      </form>
    </div>
  )
}

export default ChangePassword;
