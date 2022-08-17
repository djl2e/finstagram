import React, { useState } from 'react';
import axios from 'axios'

function Comment(props) {
  const { id } = props;
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
      .post(`/posts/${id}/comments/create`, body, config)
      .then((res) => {
        setValue('');
        window.location.reload(false);
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
