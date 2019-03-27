import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './App.css';

////Components////
import TeamList from './components/DashboardView/TeamList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/dashboard" render={props => <TeamList {...props} />} />
      </div>
    );
  }
}

export default App;
