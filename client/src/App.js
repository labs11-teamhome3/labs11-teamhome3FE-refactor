import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Auth from './Auth/Auth.js'

import './App.css';

////Components////
import DashboardView from './views/DashboardView';
import TeamView from './views/TeamView';
import LandingView from './views/LandingView';
import NavigationView from './views/NavigationView';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavigationView auth={auth} />
        <Route exact path='/'
        render={props => <LandingView {...props} />} 
        />
        <Route
          path="/dashboard"
          render={(props) => {
            handleAuthentication(props);
            return <DashboardView {...props} /> 
          }}
        />
        <Route
          path="/teams/:id/home"
          render={props => <TeamView {...props} />}
        />
      </div>
    );
  }
}

export default App;
