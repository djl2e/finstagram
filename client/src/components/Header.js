import React from 'react';
import { Link } from 'react-router-dom';

function Header(props) {
  return (
    <div className="header">
      <Link to="/">Finstagram</Link>
      <input type="text" placeholder="search for username"/>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/posts/create">New Post</Link>
        <Link to="/users/profile">Profile</Link>
      </nav>
    </div>
  )
}

export default Header;
