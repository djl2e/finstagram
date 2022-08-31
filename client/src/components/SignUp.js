import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/LogIn.css';

function SignUp() {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function submitForm(e) {
    e.preventDefault();
    axios
      .post('/api/auth/signup', {
        'form-name': fullname,
        'form-username': username,
        'form-password': password,
        'form-confirm': confirm,
      })
      .then((res) => {
          navigate('/auth/login', {state: {signup: res.data}});
      })
      .catch((err) => {
        setError(err.response.data.message);
      })
  }

  return (
    <div className="signup-container">
      <div className="signup-page">
        <h1 id="signup-header">Finstagram</h1>
        <p id="signup-title">Sign up to see photos and videos from your friends.</p>
        <div className="error-container">
            <p className="error-message" hidden={error ? false : true}>{error} Please try again.</p>
        </div>
        <form action="/auth/signup" className="signup-form" onSubmit={submitForm}>
          <input type="text" placeholder="Full Name" required onChange={(e) => setFullname(e.target.value)}/>
          <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)}/>
          <input type="password" placeholder="Password" required minLength="6" onChange={(e) => setPassword(e.target.value)}/>
          <input type="password" placeholder="Confirm Password" required minLength="6"onChange={(e) => setConfirm(e.target.value)}/>
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="login-link">
          <p>Have an account?</p>
          <Link to="/auth/login">Log In</Link>
        </div>
    </div>
  )
}

export default SignUp;