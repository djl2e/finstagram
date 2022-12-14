import React, { useState } from "react";
import axios from 'axios';
import List from './List';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import '../style/Exp.css';

function Like(props) {
  const { user, id } = props;

    // initial state of hasLiked, whether user has previously liked the post or not
  const [hasLiked, setHasLiked] = useState(props.likes.some((like) => {
    if (user) {
      return like.likedBy === user._id;
    }
    return false;
  }));
  const [likes, setLikes] = useState(props.likes);
  const [show, setShow] = useState('');

  if (user == null) return;
  
  const emptySrc = `https://finstagram-images.s3.us-east-1.amazonaws.com/heart.png`;
  const fullSrc = `https://finstagram-images.s3.us-east-1.amazonaws.com/heart_clicked.png`;

  function onClick() {
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    if (!hasLiked) {
      axios
      .post(`/api/posts/${id}/like`, {}, config)
      .then((res) => {
        res.data.likedBy = res.data.likedBy._id;
        setHasLiked(true);
        setLikes([...likes, res.data]);
      })
      .catch((err) => {
        console.log(err);
      })
    } else {
      axios
      .post(`/api/posts/${id}/unlike`, {}, config)
      .then((res) => {
        setHasLiked(false);
        setLikes(likes.filter((like) => {
          return like.likedBy !== user._id;
        }));
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }
  
  return (
    <div className="likes">
      <button className="like-button" onClick={onClick}>
        <LazyLoadImage src={hasLiked ? fullSrc : emptySrc} alt="likes" height="25" width="auto" effect="blur"/>
      </button>
      <button className="show-likes" onClick={(e) => setShow('likes')}>
        <p>Liked by <strong>{likes.length}</strong> {likes.length === 1 ? "user" : "users"}</p>
      </button>
      { show === '' ? null :
      <div className="list-container" onClick={(e) => setShow('')}>
        <List list={likes} type="likes"/>        
      </div>
      }
    </div>
  )
}

export default Like;
