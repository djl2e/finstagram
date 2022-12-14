import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../style/LogIn.css';

function LogIn(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
 
  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);

  function submitForm(e) {
    e.preventDefault();
    axios
      .post('/api/auth/login', {
        username, password,
      })
      .then((res) => {
        localStorage.setItem('token', JSON.stringify(res.data.token));
        props.setIsLoggedIn(true);
        navigate('/');
      })
      .catch((err) => {
        setError(err.response.data.message);
      })
  }

  return (
    <div className="login-container">
      <div className="login-page">
        <h1 id="login-header">Finstagram</h1>
        <div className="error-container">
          <p className="error-message" hidden={(location.state || error) ? false : true}>{location.state ? location.state.signup.message : error}</p>
          <p className="error-message" hidden={(!location.state && error) ? false : true}>
            If you have an account please try again. If not, please sign up for a new account.
          </p>
        </div>
        <form action="/auth/login" className="login-form" onSubmit={submitForm}>
          <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)}/>
          <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} minLength="6"/>
          <button type="submit">Log In</button>
        </form>
      </div>
      <div className="signup-link">
        <p>Don't have an account?</p>
        <Link to="/auth/signup">Sign Up</Link>
      </div>
    </div>
  )
}

export default LogIn;
