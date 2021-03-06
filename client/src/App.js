import React, { useEffect } from 'react';
import { Route, withRouter } from 'react-router-dom';

import Auth from './Auth/Auth.js'
//import handleAuthentication from './Auth/handleAuthentication';

import gql from 'graphql-tag';

import {useMutation} from "./graphQL/useMutation";
import './App.css';
// import DashboardView from './views/DashboardView';
import TeamView from './views/TeamView';
import LoadingView from './views/LoadingView';
// import NavigationView from './views/NavigationView';
import ProfileView from './views/ProfileView';
import LandingPage from './views/LandingPage';
import NewTeam from './views/NewTeam';

import { AUTHENTICATE_USER } from './graphQL/Mutations';

const auth = new Auth();

const App = (props) => {

    // useEffect(() => {
    //   if(localStorage.getItem('userId')) {
    //     // props.history.push('/dashboard')
    //   } else {
    //     handleAuthentication()
    //   }
    // }
    // , [])

    // const [authenticateUser] = useMutation(AUTHENTICATE_USER, {
    //     onCompleted: e => {
    //       localStorage.setItem('userId', e.authenticateUser.id)
    //       if (e.authenticateUser.inTeam.length > 0) {
    //         props.history.push(`/teams/${e.authenticateUser.inTeam[0].id}/home`)
    //       } else {
    //         props.history.push(`/teams/first-team`)
    //       }
    //   },
    //   onError: err => console.log(err)
    // });

    // function handleAuthentication() { 
    //     auth.auth0.parseHash((err, authResult) => {
    //       if (authResult && authResult.accessToken && authResult.idToken) {
    //         authenticateUser({
    //           variables: { idToken: authResult.idToken }
    //         })
    //       } else if (err) {
    //         console.log(err);
    //       }
    //     });
    // }

    return (
      <div className="App">
        {/* <NavigationView auth={auth} /> */}
        <Route exact path='/'
        render={props => <LandingPage auth={auth} {...props} />} />
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
        <Route
          path="/loading"
          render={props => <LoadingView {...props} />}
        />
      </div>
    );
}

export default withRouter(App);
