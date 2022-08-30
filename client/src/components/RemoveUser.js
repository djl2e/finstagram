import axios from 'axios';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'

function RemoveUser(props) {
  const navigate = useNavigate();

  function submitDelete(e) {
    e.preventDefault();
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    axios
      .post('/api/users/delete', {}, config)
      .then((res) => {
        localStorage.setItem('token', JSON.stringify(null));
        props.setUser(undefined);
        props.setIsLoggedIn(false);
        navigate('/auth/login');
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div className="remove-user-page main">
      <form className="remove-user-form" onSubmit={submitDelete}>
        <p>Delete User: {props.user.username}?</p>
        <button type="submit">Yes, Delete</button>
        <Link to={`/users/${props.user._id}`}>No, Return Back to Profile</Link>
      </form>
    </div>
  )
}

export default RemoveUser;
