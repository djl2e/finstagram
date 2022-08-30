import React, { useState } from 'react';
import axios from 'axios'
import '../style/Exp.css';

function Comment(props) {
  const { id, comments, setComments } = props;
  const [value, setValue] = useState('');

  function onSubmit(e) {
    e.preventDefault();
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    const body = {
      'form-comment': value,
    }
    axios
      .post(`/api/posts/${id}/comments/create`, body, config)
      .then((res) => {
        setValue('');
        const newComment = res.data;
        newComment.post = newComment.post._id;
        newComment.user = newComment.user._id;
        setComments([...comments, newComment]);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <form className="comment" onSubmit={onSubmit}>
      <input type="text" value={value} required onChange={(e) => setValue(e.target.value)} />
      <button type="submit">Post</button>
    </form>
  )
}

export default Comment;
