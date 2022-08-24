import axios from 'axios';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import List from './List';

function UserHeader(props) {
  const { user, following, posts, mainUser } = props; 
  const [followers, setFollowers] = useState(props.followers);
  const [isFollowing, setIsFollowing] = useState(props.followers.some((follower) => {
    return follower.following === mainUser._id;
  }))
  const [show, setShow] = useState('');
  const other = useParams().id;

  if (user == null) return;

  const imgSrc = `https://finstagram-images.s3.us-east-1.amazonaws.com/${user.image}`;

  function onClick() {
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    if (!isFollowing) {
      axios
        .post(`/users/follow/${other}`, {}, config)
        .then((res) => {
          const newFollow = res.data;
          setIsFollowing(true);
          setFollowers([...followers, newFollow]);
        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      axios
        .post(`/users/unfollow/${other}`, {}, config)
        .then((res) => {
          const newFollow = res.data;
          setIsFollowing(false);
          setFollowers(followers.filter((follower) => {
            return follower.following !== newFollow.following;
          }));
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
  
  return (
    <div className="user-header-with-list">
      <div className="user-header">
        <div id="user-pic-cropper">
          <img src={imgSrc} alt="user" id="user-pic"/>
        </div>
        <div className="user-info">
          <div className="user-top">
            <p>{user.username}</p>
            {user._id === mainUser._id ? 
            <Link to="/users/update">Edit Profile</Link> : 
            isFollowing ?
            <button className="unfollow" onClick={(e) => onClick(e)}>Unfollow</button>
            :
            <button className="follow" onClick={(e) => onClick(e)}>Follow</button>
            }
          </div>
          <div className="user-stats">
            <p><strong>{posts.length}</strong> posts</p>
            <button onClick={(e) => setShow('followers')}><p><strong>{followers.length}</strong> followers</p></button> 
            <button onClick={(e) => setShow('following')}><p><strong>{following.length}</strong> following</p></button> 
          </div>
          <div className="user-bottom">
            <p id="user-fullname">{user.name}</p>
            <p>{user.description}</p>
          </div>
        </div>
      </div>
      {show === '' ? null :
      <div className="list-container" onClick={(e) => setShow('')}>
        {
          show === 'followers' ?
          <List list={followers} type="followers"/> :
          <List list={following} type="following"/>
        }
      </div>
      }
    </div>
  )
}

export default UserHeader;
