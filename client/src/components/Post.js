import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import time from '../time';
import MiniView from './MiniView';
import Like from './Like';

function Post() {
  const [post, setPost] = useState(undefined);
  const [imgSrc, setImgSrc] = useState('');
  const [date, setDate] = useState('');
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const id = useParams().id;

  useEffect(() => {
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    axios
      .get(`/posts/${id}`, config)
      .then((res) => {
        setPost(res.data.post);
        setImgSrc(`https://finstagram-images.s3.us-east-1.amazonaws.com/${res.data.post.image}`);
        setDate(time(res.data.post.date));
        setComments(res.data.comments);
        setLikes(res.data.likes);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [id])

  if (isLoading) {
    return null;
  } 

  return (
    <div className="post-page">
      <img src={imgSrc} alt="post main" />
      <div className="post-info">
        <div className="post-header">
          <MiniView user={post.user} date={date} content={post.caption}/>
        </div>
        <div className="post-comments">
          {comments.map((comment) => <MiniView user={comment.user} date={time(comment.date)} content={comment.content}/>)}
        </div>
        <Like likes={likes} />
      </div>
    </div>
  )

}

export default Post;
