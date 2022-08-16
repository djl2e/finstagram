import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header(props) {
  const navigate = useNavigate();

  if (props.user == null) {
    return;
  } 

  const userId = props.user._id;

  function signout() {
    localStorage.setItem('token', JSON.stringify(null));
    props.setUser(undefined);
    props.setIsLoggedIn(false);
    navigate('/auth/login');
  }

  return (
    <div className="header">
      <Link to="/">Finstagram</Link>
      <input type="text" placeholder="search for username"/>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/posts/create">New Post</Link>
        <Link to={"/users/" + userId}>Profile</Link>
        <button onClick={signout}>Log Out</button>
      </nav>
    </div>
  )
}

export default Header;
