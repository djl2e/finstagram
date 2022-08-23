import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import time from '../time';
import PostView from './PostView';
import Like from './Like';
import Comment from './Comment';
import '../style/Post.css';


function Post(props) {
  const [post, setPost] = useState(undefined);
  const [imgSrc, setImgSrc] = useState('');
  const [date, setDate] = useState('');
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const id = useParams().id;
  const { mainUser } = props;
  const navigate = useNavigate();

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

  if (isLoading || mainUser == null) {
    return null;
  }

  return (
    <div className="post-page" onClick={(e) => navigate(-1)}>
      <div className="post-material">
        <div className="post-img-container">
          <img src={imgSrc} alt="post main" />
        </div>
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
              post={post}
              setPost={setPost}
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
                comments={comments}
                setComments={setComments}
              />)}
          </div>
          <div className="post-action">
            <Like likes={likes} user={mainUser} id={id}/>
            <Comment id={id} comments={comments} setComments={setComments}/>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Post;
