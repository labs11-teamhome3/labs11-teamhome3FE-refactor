import React, { useEffect } from 'react';
import gql from 'graphql-tag';

////Components////
import TeamList from '../components/DashboardView/TeamList';

const DashboardView = props => {
  return (
    <div>
      <h1>DashboardView</h1>
      <TeamList /> 
    </div>
  );
};

export default DashboardView;
