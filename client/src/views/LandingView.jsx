import React from "react";
import { Link } from "react-router-dom";

const LandingView = props => {
  const auth = () => {
    props.auth.login();
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
