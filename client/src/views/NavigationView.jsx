import React from 'react';

////Components////
import { Button } from '../../node_modules/@material-ui/core';

const NavigationView = props => {
  const login = () => {
    props.auth.login();
  }

  const logout = () => {
    props.auth.logout();
  }

  return (
    <div>
      <h1>NavBar</h1>
      <Button onClick={login}>Log in</Button>
      <Button onClick={logout}>Log out</Button>
    </div>
  );
};

export default NavigationView;