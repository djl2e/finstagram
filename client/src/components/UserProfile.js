import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';
import UserHeader from './UserHeader';
import UserPost from './UserPost';
import '../style/User.css';

function UserProfile(props) {
  const[isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(undefined);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [posts, setPosts] = useState([]);
  const id = useParams().id;
  const mainUser = props.user;

  useEffect(() => {
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    }
    axios
      .get(`/users/${id}`, config)
      .then((res) => {
        setUser(res.data.user);
        setFollowing(res.data.following);
        setFollowers(res.data.followers);
        setPosts(res.data.posts);
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
    <div className="profile-page main">
      <UserHeader 
        user={user}
        following={following}
        followers={followers}
        posts={posts}
        mainUser={mainUser}
      />
      <div className="profile-posts">
        {posts.map((post) => <UserPost post={post} origin="post" key={"profile" + post._id}/>)}
      </div> 
    </div>
  );

}


export default UserProfile;
