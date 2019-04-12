import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';

////Components////
import TeamList from '../components/DashboardView/TeamList';

// css //
import './css/Dashboard.css'

const DashboardView = props => {
  return (
    <div className="teams-list">
      {!localStorage.getItem('userId')
        ? <h2>Please login to access the dashboard</h2>
        : <>
            <h1>My Teams</h1>
            <TeamList 
              history={props.history} 
              match={props.match}
            /> 
          </>
      }
    </div>
  );
};

export default DashboardView;
