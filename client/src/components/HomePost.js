import React from 'react';
import { Link } from 'react-router-dom';
import MiniView from './MiniView';
import Like from './Like';
import Comment from './Comment';
import time from '../time';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import '../style/Home.css';

function HomePost(props) {
  const { post, mainUser } = props;

  const user = post.user;
  const postImgSrc = `https://finstagram-images.s3.us-east-1.amazonaws.com/${post.image}`;
  const userImgSrc = `https://finstagram-images.s3.us-east-1.amazonaws.com/${user.image}`;
  const postDate = time(post.date);
  
  return (
    <div className="home-post">
      <MiniView user={user} imgSrc={userImgSrc} date={postDate} />
      <div className="home-img-container">
        <LazyLoadImage className="home-img" src={postImgSrc} effect="blur" height="700" width="auto"/>
      </div>
      <Like likes={post.likes} user={mainUser} id={post._id} />
      <p className="home-caption">{post.caption}</p>
      <Link to={`/posts/${post._id}`} className="view-comments">View all comments</Link>
      <Comment id={post._id}/>
    </div>
  )
}

export default HomePost;