import React from "react";
import { Link } from 'react-router-dom';

function Like(props) {
  const { likes } = props;
  const imgSrc = `https://finstagram-images.s3.us-east-1.amazonaws.com/heart.png`;
  
  return (
    <div className="likes">
      <img src={imgSrc} alt="likes" />
      <p>Liked by {likes.length} users</p>
    </div>
  )
}

export default Like;
