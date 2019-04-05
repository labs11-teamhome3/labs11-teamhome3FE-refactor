import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';

////Components////
import TeamList from '../components/DashboardView/TeamList';

const DashboardView = props => {
  return (
    <div>
      {!localStorage.getItem('userId')
        ? <h2>Please login to access the dashboard</h2>
        : <>
            <h1>My Teams</h1>
            <TeamList /> 
          </>
      }
    </div>
  );
};

export default DashboardView;
