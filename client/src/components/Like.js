import React, { useState } from "react";
import axios from 'axios';
import '../style/Exp.css';

function Like(props) {
  const { user, id } = props;

    // initial state of hasLiked, whether user has previously liked the post or not
  const [hasLiked, setHasLiked] = useState(props.likes.some((like) => {
    return like.likedBy === user._id;
  }));
  const [likes, setLikes] = useState(props.likes);

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
      .post(`/posts/${id}/like`, {}, config)
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
      .post(`/posts/${id}/unlike`, {}, config)
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
        <img src={hasLiked ? fullSrc : emptySrc} alt="likes" />
      </button>
      <p>Liked by {likes.length} {likes.length === 1 ? "user" : "users"}</p>
    </div>
  )
}

export default Like;
