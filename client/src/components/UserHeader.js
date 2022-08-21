import React from 'react';
import { Link } from 'react-router-dom';

function UserHeader(props) {
  const { user, following, followers, posts, mainUser } = props; 
  const imgSrc = `https://finstagram-images.s3.us-east-1.amazonaws.com/${user.image}`;
  return (
    <div className="user-header">
      <div id="user-pic-cropper">
        <img src={imgSrc} alt="user" id="user-pic"/>
      </div>
      <div className="user-info">
        <div className="user-top">
          <p>{user.username}</p>
          {user._id === mainUser._id ? <Link to="/users/update">Edit Profile</Link>: null}
        </div>
        <div className="user-stats">
          <p>{posts.length} posts</p>
          <p>{followers.length} followers</p>
          <p>{following.length} following</p>
        </div>
        <div className="user-bottom">
          <p id="user-fullname">{user.name}</p>
          <p>{user.description}</p>
        </div>
      </div>
    </div>
  )
}

export default UserHeader;
