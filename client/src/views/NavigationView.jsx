import React, { useEffect } from 'react';
import gql from 'graphql-tag';

////Components////
import {useMutation} from "../graphQL/useMutation";
import { authenticateUser } from '../Auth/Authenticate';
import { Button } from '../../node_modules/@material-ui/core';

const AUTHENTICATE_USER = gql`
  mutation AUTHENTICATE_USER(
    $authId: String!
  ) {
    authenticateUser(
      authId: $authId
    ) {
      id
      name
    }
  }
`

const NavigationView = props => {
  
  const [authenticateUser] = useMutation(AUTHENTICATE_USER, {
    variables: {
      authId: localStorage.getItem('authId')
    },
    onCompleted: e => {
      alert('Welcome User'); 
    },
    onError: err => console.log(err)
  })

  useEffect(() => {
    console.log('before')
    if(localStorage.getItem('authId')) {
      console.log('after')
      authenticateUser();
    }
  }, [])

  const login = async() => {
    await props.auth.login();
  }

  const logout = () => {
    props.auth.logout();
  }

  return (
    <div>
      <h1>NavBar</h1>
      <Button onClick={login}>Log in</Button>
      <Button onClick={logout}>Log out</Button>
    </div>
  );
};

export default NavigationView;