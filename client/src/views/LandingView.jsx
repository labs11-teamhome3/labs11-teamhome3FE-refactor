import React from "react";
import { Link } from "react-router-dom";

const LandingView = props => {
  return (
    <div>
      <Link to="/dashboard">
        <h1>To Dashboard</h1>
      </Link>
    </div>
  );
};

export default LandingView;
