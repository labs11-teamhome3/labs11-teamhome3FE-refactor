import React from 'react';
// import { Link } from 'react-router-dom'
import logo from '../assets/Manaje.png'

import './css/Nav.css'
// import { Button, AppBar, Toolbar } from '../../node_modules/@material-ui/core';

////Components////
// import TabNavigator from '../components/TeamView/TabNavigator';
import Drawer from '../components/Drawer/Drawer'



const TeamView = props => {
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
      <Drawer 
        match={props.match} 
        history={props.history}
        login={login}
        signup={signup}
        logout={logout}
        logo={logo}  
      />
      {/* <TabNavigator match={props.match} history={props.history} /> */}
      {/* <TodoListContainer match={props.match} history={props.history} /> */}
    </div>
  );
};

export default TeamView;
