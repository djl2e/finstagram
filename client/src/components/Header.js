import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/Header.css'
import MiniView from './MiniView';

function Header(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const imgSrc = 'https://finstagram-images.s3.us-east-1.amazonaws.com/';

  useEffect(() => {
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      params: {
        search: '',
      }
    }
    axios
      .get('/api/users/search', config)
      .then((res) => {
        setSearchResult(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])  

  useEffect(() => {
    const config = {
      headers: { 
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      params: {
        search: searchValue,
      }
    }
    axios
      .get('/api/users/search', config)
      .then((res) => {
        setSearchResult(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [searchValue])

  if (isLoading || props.user == null) {
    return;
  } 

  const userId = props.user._id;

  function hideSearch() {
    const searchResults = document.getElementsByClassName('search-results');
    if (searchResult == null) return;
    searchResults.style.visibility = 'hidden';
  }

  function signout() {
    localStorage.setItem('token', JSON.stringify(null));
    props.setUser(undefined);
    props.setIsLoggedIn(false);
    navigate('/auth/login');
  }

  return (
    <div className="header">
      <Link to="/" id="logo">Finstagram</Link>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="search for username" 
          id="search-bar" 
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
        <div className="search-results">
          {searchResult.map((user) => 
            <MiniView user={user} imgSrc={imgSrc + user.image} hideSearch={hideSearch} key={`search-${user._id}`} />
          )}
        </div>
      </div>
      <nav>
        <Link to="/">
          <img src={imgSrc + 'home.png'} alt="home" height="30" width="auto"/>
        </Link>
        <Link to="/posts/create">
          <img src={imgSrc + 'add.png'} alt="new post" height="30" width="auto"/>
        </Link>
        <Link to={"/users/" + userId}>
          <img src={imgSrc + 'user.png'} alt="profile" height="30" width="auto"/>
        </Link>
        <button onClick={signout}>Log Out</button>
      </nav>
    </div>
  )
}

export default Header;
