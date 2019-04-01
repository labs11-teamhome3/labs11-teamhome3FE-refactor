import React from 'react';

////Components////
import TeamList from '../components/DashboardView/TeamList';
import { Button } from '../../node_modules/@material-ui/core';

const DashboardView = props => {
  const auth = () => {
    props.auth.logout();
  }


  return (
    <div>
      <h1>DashboardView</h1>
      <Button onClick={auth}>Log out</Button>
      <TeamList /> 
    </div>
  );
};

export default DashboardView;
