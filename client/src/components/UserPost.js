import React from 'react';
import { Link } from 'react-router-dom';

function UserPost(props) {
  const { post } = props;
  const imgSrc = `https://finstagram-images.s3.us-east-1.amazonaws.com/${post.image}`;
  return (
    <Link to={"/posts/" + props.post._id} className="user-posts">
      <img src={imgSrc} alt="profile"/>
    </Link>
  )
}

export default UserPost;