import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Manaje.png';

import './css/Nav.css';

////Components////
import { Button, AppBar } from '../../node_modules/@material-ui/core';

const NavigationView = props => {


  const login = async () => {
    await props.auth.login();
  };

  const signup = async () => {
    await props.auth.signup();
  };

  const logout = () => {
    props.auth.logout();
  };

  return (
    <div>
      <AppBar className="header" position="static">
        <div className="header">
          <div className="logo">
              <img className="logo-img" src={logo} alt="Manaje" />
          </div>
          {!localStorage.getItem('userId') ? (
            <div className="nav-btns">
              <Button onClick={login}>Log in</Button>
              <Button onClick={signup}>Sign Up</Button>
            </div>
          ) : (
            <div className="nav-btns">
              {/* <Link to="/teams/first-team">
                <Button>Dashboard</Button>
              </Link> */}
              <Link to="/profile">
                <Button>Profile</Button>
              </Link>
              <Button onClick={logout}>Log out</Button>
            </div>
          )}
        </div>
      </AppBar>
    </div>
  );
};

export default NavigationView;
