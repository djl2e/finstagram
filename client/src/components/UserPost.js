import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import '../style/View.css';

function UserPost(props) {
  const { post } = props;
  const imgSrc = `https://finstagram-images.s3.us-east-1.amazonaws.com/${post.image}`;
  return (
    <Link to={"/posts/" + props.post._id} className="user-posts">
      <LazyLoadImage src={imgSrc} effect="blur" height="700" width="auto"/>
    </Link>
  )
}

export default UserPost;