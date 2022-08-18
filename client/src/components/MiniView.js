import React from 'react';
import { Link } from 'react-router-dom';

function MiniView(props) {
  const { user, imgSrc, date } = props;

  return (
    <div className="mini-view">
      <Link to={`/users/${user._id}`}>
        <img src={imgSrc} alt="user mini" />
      </Link>
      <div className="mini-info">
        <Link to={`/users/${user._id}`}>
          <p className="mini-username">{user.username}</p>
        </Link>
        <p className="mini-date">{date}</p>
      </div>
    </div>
  )
}

export default MiniView;
