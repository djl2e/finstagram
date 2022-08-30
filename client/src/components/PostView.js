import React, { useState } from "react";
import axios from 'axios';
import MiniView from './MiniView';
import EditPost from './EditPost';
import RemovePost from './RemovePost';
import '../style/View.css';

function PostView(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(props.user);
  const [editing, setEditing] = useState(false);
  const [editMode, setEditMode] = useState('edit');

  const { 
    date, 
    content, 
    type, 
    mainUserId, 
    postId,
    post,
    setPost, 
    commentId, 
    comments, 
    setComments 
  } = props;

  // if type is comment, user comes in as a id, this helps populate user field
  if (typeof user == 'string') {
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    axios
      .get(`/api/users/${user}/mini`, config)
      .then((res) => {
        setUser(res.data.user);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  if (typeof user == 'string' && isLoading) {
    return;
  }

  const imgSrc = `https://finstagram-images.s3.us-east-1.amazonaws.com/${user.image}`;

  function editCaption() {
    setEditing(true);
    setEditMode('edit');
  }

  function deletePost() {
    setEditing(true);
    setEditMode('delete');
  }

  function deleteComment() {
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    axios
      .post(`/api/posts/${postId}/comments/${commentId}/delete`, {}, config)
      .then((res) => {
        setComments(comments.filter((comment) => {
          return comment._id !== commentId;
        }));
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const deleteButton = (
    type === 'post' ?
      <div className="post-options">
        <button className="edit-caption" onClick={(e) => editCaption()}>Edit</button>
        <button className="delete-post" onClick={(e) => deletePost()}>Delete</button>
      </div> 
      :
      <button className="delete-comment" onClick={deleteComment}>✖</button>
  )

  return (
    <div className="post-view">
      <div className="content">
        <MiniView user={user} imgSrc={imgSrc} date={date} />
        {!editing ?
        <div className="content-text">{content}</div>
        : null }
      </div>
      { !editing ?
      <div className="post-buttons">
        {user._id === mainUserId ? deleteButton : null}
      </div>
      :
      editMode === 'edit' ?
      <EditPost postId={postId} setEditing={setEditing} post={post} setPost={setPost}/>
      :
      <RemovePost postId={postId} mainUserId={mainUserId} setEditing={setEditing}/>
      }
    </div>
  )
}

export default PostView;
