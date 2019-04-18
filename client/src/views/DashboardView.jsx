import React from 'react';

////Components////
import TeamList from '../components/DashboardView/TeamList';
import Typography from '@material-ui/core/Typography';

// css //
import './css/Dashboard.css';

const DashboardView = props => {
  return (
    <div className="teams-list">
      {!localStorage.getItem('userId') ? (
        <Typography component="h2">
          Please login to access the dashboard
        </Typography>
      ) : (
        <>
          <TeamList history={props.history} match={props.match} />
        </>
      )}
    </div>
  );
};

export default DashboardView;
