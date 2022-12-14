import React, { useState } from 'react';
import HomePost from './HomePost';
import UserSuggestion from './UserSuggestion';
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
      .get('/api/posts/home', config)
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
    <div className="home-page main">
      <div className="home-posts">
        {posts.map((post) => 
          <HomePost post={post} mainUser={user} key={`home-post-${post._id}`} />
        )}
      </div>
      <div className="home-suggestions">
        <p className="suggestion-header">Suggestions for you:</p>
        <UserSuggestion />
      </div>
    </div>
  )
}

export default Home;
