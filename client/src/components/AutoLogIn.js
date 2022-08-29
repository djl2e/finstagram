import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from "react-router-dom";

function AutoLogin(props) {
  const [toHome, setToHome] = useState(false);

  useEffect(() => {
    setToHome(props.isLoggedIn);
  }, [props.isLoggedIn])

  return (
    !toHome ? <Outlet /> : <Navigate to="/" />
  )
}

export default AutoLogin;