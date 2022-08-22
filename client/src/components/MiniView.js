import React from 'react';
import { Link } from 'react-router-dom';
import '../style/View.css';

function MiniView(props) {
  const { user, imgSrc, date } = props;

  return (
    <div className="mini-view">
      <Link to={`/users/${user._id}`} className="user-mini-cropper">
        <img src={imgSrc} alt="user mini" className="user-mini-img"/>
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
