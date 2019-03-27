import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './App.css';

////Components////
import DashboardView from './views/DashboardView';
import TeamView from './views/TeamView';

class App extends Component {
  render() {
    return (
      <div className="App">
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
