import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute(props) {
  const [toHome, setToHome] = useState(true);

  useEffect(() => {
    setToHome(props.isLoggedIn);
  }, [props.isLoggedIn])

  return (
    toHome ? <Outlet /> : <Navigate to="/auth/login" />
  )
}

export default ProtectedRoute;
