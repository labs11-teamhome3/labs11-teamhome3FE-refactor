import React from "react";
import { Link } from "react-router-dom";

const LandingView = props => {
  const auth = async () => {
    await props.auth.login();
    console.log('now for the handleAuth');
    props.auth.handleAuthentication();
  }

  return (
    <div>
      <Link to="/dashboard">
        <h1>To Dashboard</h1>
      </Link>
      <button onClick={auth}>Login</button>
    </div>
  );
};

export default LandingView;
