import React, { useEffect } from 'react';
import { Route, withRouter } from 'react-router-dom';

import Auth from './Auth/Auth.js'
//import handleAuthentication from './Auth/handleAuthentication';

import gql from 'graphql-tag';

import {useMutation} from "./graphQL/useMutation";
import './App.css';
import DashboardView from './views/DashboardView';
import TeamView from './views/TeamView';
import LandingView from './views/LandingView';
import NavigationView from './views/NavigationView';
import ProfileView from './views/ProfileView';

const auth = new Auth();

const AUTHENTICATE_USER = gql`
  mutation AUTHENTICATE_USER(
    $idToken: String!
  ) {
    authenticateUser(
      idToken: $idToken
    ) {
      id
      name
    }
  }
`

const App = (props) => {
    useEffect(() => {
      if(localStorage.getItem('userId')) {
        props.history.push('/dashboard')
      } else {
        handleAuthentication()
      }
    }
    , [])

    const [authenticateUser] = useMutation(AUTHENTICATE_USER, {
        onCompleted: e => {
          alert('Welcome User'); 
          localStorage.setItem('userId', e.authenticateUser.id)
          props.history.push('/dashboard')
          window.location.reload();
      },
      onError: err => console.log(err)
    });

    function handleAuthentication() { 
        auth.auth0.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
            authenticateUser({
              variables: { idToken: authResult.idToken }
            })
          } else if (err) {
            console.log(err);
          }
        });
    }

    return (
      <div className="App">
        <NavigationView auth={auth} />
        <Route exact path='/'
        render={props => <LandingView {...props} />} />
        <Route
          path="/dashboard"
          render={ (props) => <DashboardView {...props} /> }/>
        <Route
          path="/teams/:id/home"
          render={props => <TeamView {...props} />}
        />
        <Route
          path="/profile/"
          render={props => <ProfileView {...props} />}
        />
      </div>
    );
}

export default withRouter(App);
