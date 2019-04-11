import React, { useEffect } from 'react';
import { Route, withRouter } from 'react-router-dom';

import Auth from './Auth/Auth.js'
//import handleAuthentication from './Auth/handleAuthentication';

import gql from 'graphql-tag';

////Components////
import setSession from './Auth/setSession';
import history from './history';
import {useMutation} from "./graphQL/useMutation";

import './App.css';

////Components////
import DashboardView from './views/DashboardView';
import TeamView from './views/TeamView';
import LandingView from './views/LandingView';
import NavigationView from './views/NavigationView';
import ProfileView from './views/ProfileView';
import NewTeam from './views/NewTeam';

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
      inTeam {
        id
      }
    }
  }
`

const App = (props) => {
    useEffect(() => {
      if(localStorage.getItem('userId')) {
        // props.history.push('/dashboard')
      } else {
        handleAuthentication()
      }
    }
    , [])

    const [authenticateUser] = useMutation(AUTHENTICATE_USER, {
        onCompleted: e => {
          // console.log('first team id', e.authenticateUser.inTeam[0].id);
          // alert('Welcome User'); 
          localStorage.setItem('userId', e.authenticateUser.id)
          if (e.authenticateUser.inTeam.length > 0) {
            props.history.push(`/teams/${e.authenticateUser.inTeam[0].id}/home`)
          } else {
            props.history.push(`/teams/first-team`)
          }
          // props.history.push('/dashboard')
          // window.location.reload();
      },
      onError: err => console.log(err)
    });

    function handleAuthentication() { 
      console.log('auth')
        auth.auth0.parseHash((err, authResult) => {
          console.log('ar', authResult)
          if (authResult && authResult.accessToken && authResult.idToken) {
            //setSession(authResult)
            authenticateUser({
              variables: { idToken: authResult.idToken }
            })
            //setSession(authResult);
          } else if (err) {
            console.log(err);
          }
        });
      
    }
   

    return (
      <div className="App">
        {/* <NavigationView auth={auth} /> */}
        <Route exact path='/'
        render={props => <LandingView auth={auth} {...props} />} />
        <Route
          path="/teams/first-team"
          render={ (props) => <NewTeam auth={auth} {...props} /> }/>
        <Route
          path="/teams/:id/home"
          render={props => <TeamView auth={auth} {...props} />}
        />
        <Route
          path="/profile/"
          render={props => <ProfileView auth={auth} {...props} />}
        />
      </div>
    );
}

export default withRouter(App);
