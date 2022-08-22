import React, { useState } from 'react';
import axios from 'axios';
import MiniView from './MiniView';

function UserSuggestion() {
  const [isLoading, setIsLoading] = useState(true);
  const [suggested, setSuggested] = useState([]);
  const imgSrc = `https://finstagram-images.s3.us-east-1.amazonaws.com/`;

  useState(() => {
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    axios
      .get('/users/suggested', config)
      .then((res) => {
        setSuggested(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  if (isLoading) return null;

  return (
    <div className="suggestions">
      {suggested.map((user) => 
        <MiniView user={user} imgSrc={imgSrc + user.image} />
      )}
    </div>
  )

}

export default UserSuggestion;
