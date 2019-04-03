import React, { useEffect } from 'react';
import gql from 'graphql-tag';

////Components////
import {useMutation} from "../graphQL/useMutation";
import TeamList from '../components/DashboardView/TeamList';

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

const DashboardView = props => {
  const [authenticateUser] = useMutation(AUTHENTICATE_USER, {
    update: (cache, { data }) => {
      localStorage.setItem('userId', data.authenticateUser.id)
    },
    variables: {
      idToken: localStorage.getItem('idToken')
    },
    onCompleted: e => {
      alert('Welcome User'); 
    },
    onError: err => console.log(err)
  })

  useEffect(() => {
    console.log('useEff')
    // if(localStorage.getItem('idToken')) {
      authenticateUser();
    //}
  }, [localStorage.getItem('idToken')])

  return (
    <div>
      <h1>DashboardView</h1>
      <TeamList /> 
    </div>
  );
};

export default DashboardView;
