import React, { useState } from 'react';
import HomePost from './HomePost';
import axios from 'axios';

function Home(props) {
  const { user } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useState(() => {
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    axios
      .get('/posts/home', config)
      .then((res) => {
        setPosts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  if (isLoading) return;

  return (
    <div className="home-page">
      <div className="home-posts">
        {posts.map((post) => 
          <HomePost post={post} mainUser={user} key={`home-post-${post._id}`} />
        )}
      </div>
    </div>
  )
}

export default Home;
