import React from 'react';
import { Link } from 'react-router-dom';
import '../style/View.css';

function MiniView(props) {
  const { user, imgSrc, date, hideSearch } = props;

  function hide() {
    if (hideSearch) {
      hideSearch();
    }
  }

  return (
    <div className="mini-view">
      <Link to={`/users/${user._id}`} className="user-mini-cropper" onClick={(e) => hide(e)}>
        <img src={imgSrc} alt="user mini" className="user-mini-img"/>
      </Link>
      <div className="mini-info">
        <Link to={`/users/${user._id}`} onClick={(e) => hide(e)}>
          <p className="mini-username">{user.username}</p>
        </Link>
        { date ?
        <p className="mini-date">{date}</p>
        : null }
      </div>
    </div>
  )
}

export default MiniView;
