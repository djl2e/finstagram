import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Header from './components/Header';
import axios from 'axios';


function App() {  

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(undefined);

  let header = null;
  if (isLoggedIn) {
    header = <Header />
  }

  return (
    <div className="App">
      {header}
      <Routes>
        <Route exact path="/auth/login" element=
          {<LogIn 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn} 
            setUser={setUser}
          />} 
        />
        <Route exact path="/auth/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
