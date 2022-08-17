import React, { useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import EditPost from './EditPost';
import RemovePost from './RemovePost';

function MiniView(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(props.user);
  const [editing, setEditing] = useState(false);
  const [editMode, setEditMode] = useState('edit');

  const { date, content, type, mainUserId, postId, commentId } = props;

  // if type is comment, user comes in as a id, this helps populate user field
  if (typeof user == 'string') {
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    axios
      .get(`/users/${user}/mini`, config)
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
      .post(`/posts/${postId}/comments/${commentId}/delete`, {}, config)
      .then((res) => {
        window.location.reload(false);
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
      <button className="delete-comment" onClick={deleteComment}>Delete</button>
  )

  return (
    <div className="user-mini">
      <Link to={`/users/${user._id}`}>
        <img src={imgSrc} alt="user mini" />
      </Link>
      <div className="mini-info">
        <Link to={`/users/${user._id}`}>
          <p className="mini-username">{user.username}</p>
        </Link>
        <p className="mini-date">{date}</p>
      </div>
      { !editing ?
      <div className="content">
        <p className="mini-content">{content}</p>
        {user._id === mainUserId ? deleteButton : null}
      </div>
      :
      editMode === 'edit' ?
      <EditPost postId={postId} setEditing={setEditing}/>
      :
      <RemovePost postId={postId} mainUserId={mainUserId} setEditing={setEditing}/>
      }
    </div>
  )
}

export default MiniView;
