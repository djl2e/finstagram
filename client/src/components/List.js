import React, { useEffect, useState } from 'react';
import MiniView from './MiniView';
import '../style/List.css';
import axios from 'axios';

function List(props) {
  const [fullList, setFullList] = useState([]);
  const { list, type } = props;
  const imgSrc = 'https://finstagram-images.s3.us-east-1.amazonaws.com/';
  
  useEffect(() => {
    const find = list.map((follow) => {
      if (type === "following") {
        return follow.followed;
      } else if (type === "followers") {
        return follow.following;
      } else {
        return follow.likedBy;
      }
    })
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      params: {
        ids: find,
      }
    }
    axios
      .get('/api/users/list', config)
      .then((res) => {
        setFullList(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [list, type]);

  return (
    <div className="list-page">
      <p className="list-title">{type[0].toUpperCase() + type.slice(1)}</p>
      {
        fullList.map((user) => <MiniView user={user} imgSrc={imgSrc + user.image} key={`list-${user._id}`}/>)
      }
    </div>
  )
}

export default List;
