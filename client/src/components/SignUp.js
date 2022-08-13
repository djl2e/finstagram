import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp(props) {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function submitForm(e) {
    e.preventDefault();
    axios
      .post('/auth/signup', {
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
    <div className="signup-page">
      <form action="/auth/signup" className="signup-form" onSubmit={submitForm}>
        <p className="signup-error" hidden={error ? false : true}>{error}</p>
        <p className="signup-error" hidden={error ? false : true}>Please try again.</p>
        <input type="text" placeholder="Full Name" onChange={(e) => setFullname(e.target.value)}/>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
        <input type="password" placeholder="Password" minLength="6" onChange={(e) => setPassword(e.target.value)}/>
        <input type="password" placeholder="Confirm Password" minLength="6"onChange={(e) => setConfirm(e.target.value)}/>
        <button type="submit">Sign Up</button>
      </form>
      <div className="login-link">
        <p>Have an account?</p>
        <Link to="../auth/login">Log In</Link>
      </div>
    </div>
  )
}

export default SignUp;