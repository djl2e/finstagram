import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import PostForm from './components/PostForm';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';
import ChangePassword from './components/ChangePassword';
import ChangeProfilePic from './components/ChangeProfilePic';
import RemoveUser from './components/RemoveUser';
import Post from './components/Post';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

function App() {  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token != null) {
      const decoded = jwt_decode(token);
      const date = new Date();
      if (decoded.exp * 1000 >= date.getTime()) {
        setIsLoggedIn(true);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const config = {
        headers: { 
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      }
      axios
        .get('/users/profile', config)
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [isLoggedIn]);

  if (isLoading) return;
  

  return (
    <div className="App">
      {!isLoggedIn ? null : <Header user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn}/>}
      <Routes>
        <Route exact path="/auth/login" element= {<LogIn setIsLoggedIn={setIsLoggedIn} />} />
        <Route exact path="/auth/signup" element={<SignUp />} />
        <Route path="/" element={<ProtectedRoute key={isLoggedIn} isLoggedIn={isLoggedIn}/>}>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/posts/create" element={<PostForm />} />
          <Route exact path="/users/:id" element={<UserProfile user={user}/>} /> 
          <Route exact path="/users/update" element={<EditProfile user={user} />} /> 
          <Route exact path="/users/password" element={<ChangePassword user={user} />} /> 
          <Route exact path="/users/image" element={<ChangeProfilePic user={user} />} /> 
          <Route exact path="/users/delete" element={<RemoveUser user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route exact path='/posts/:id' element={<Post mainUser={user}/>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
