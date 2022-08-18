import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import time from '../time';
import PostView from './PostView';
import Like from './Like';
import Comment from './Comment';


function Post(props) {
  const [post, setPost] = useState(undefined);
  const [imgSrc, setImgSrc] = useState('');
  const [date, setDate] = useState('');
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const id = useParams().id;
  const { mainUser } = props;

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
          <PostView 
            user={post.user} 
            date={date} 
            content={post.caption}
            type="post"
            mainUserId={mainUser._id}
            postId={id}
            commentId={""}
          />
        </div>
        <div className="post-comments">
          {comments.map((comment) => 
            <PostView 
              user={comment.user} 
              date={time(comment.date)} 
              content={comment.content}
              type="comment"
              mainUserId={mainUser._id}
              postId={id}
              commentId={comment._id}
              key={"profile" + id + "comment" + comment._id}
            />)}
        </div>
        <Like likes={likes} user={mainUser} id={id}/>
        <Comment id={id}/>
      </div>
    </div>
  )

}

export default Post;
