import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/Header.css'

function Header(props) {
  const navigate = useNavigate();
  const imgSrc = 'https://finstagram-images.s3.us-east-1.amazonaws.com/';

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
      <Link to="/" id="logo">Finstagram</Link>
      <input type="text" placeholder="search for username" id="search-bar"/>
      <nav>
        <Link to="/">
          <img src={imgSrc + 'home.png'} alt="home" />
        </Link>
        <Link to="/posts/create">
          <img src={imgSrc + 'add.png'} alt="new post" />
        </Link>
        <Link to={"/users/" + userId}>
          <img src={imgSrc + 'user.png'} alt="profile" />
        </Link>
        <button onClick={signout}>Log Out</button>
      </nav>
    </div>
  )
}

export default Header;
