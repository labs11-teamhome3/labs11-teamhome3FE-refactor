import React, { useEffect } from 'react';

import Auth from '../Auth/Auth.js'
import { AUTHENTICATE_USER } from '../graphQL/Mutations'
import {useMutation} from "../graphQL/useMutation";
import Loader from 'react-loader-spinner';

import NavigationView from './NavigationView';

const auth = new Auth();

const LoadingView = props => {

  useEffect(() => {
    handleAuthentication()
  }, [])

  const [authenticateUser] = useMutation(AUTHENTICATE_USER, {
    onCompleted: e => {
      localStorage.setItem('userId', e.authenticateUser.id)
      if (e.authenticateUser.inTeam.length > 0) {
        props.history.push(`/teams/${e.authenticateUser.inTeam[0].id}/home`)
      } else {
        props.history.push(`/teams/first-team`)
      }
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
    <>
      <NavigationView auth={auth} />
      <Loader 
        type="ThreeDots"
        height="25px"
        width="25px"
        color="#0984e3"
      />
    </>
  )
}

export default LoadingView;