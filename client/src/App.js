import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Auth from './Auth/Auth.js'

import './App.css';

////Components////
import DashboardView from './views/DashboardView';
import TeamView from './views/TeamView';
import LandingView from './views/LandingView';

const auth = new Auth();

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path='/'
        render={props => <LandingView auth={auth} />} 
        />
        <Route
          path="/dashboard"
          render={props => <DashboardView {...props} />}
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
