import React, { useEffect, useState } from 'react';
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

const FIND_USER = gql`
  query USER(
    $id: ID!
  ) {
    user(
      id: $id
    ) {
      id
      name
    }
  }
`;

const DashboardView = props => {
  const [user, setUser] = useState(null);
  const [authenticateUser] = useMutation(AUTHENTICATE_USER, {
    update: (cache, { data }) => {
      localStorage.setItem('userId', data.authenticateUser.id)
      console.log('##########################################################')
    },
    variables: {
      idToken: localStorage.getItem('idToken')
    },
    onCompleted: e => {
      setUser(e.authenticateUser.id)
      alert('Welcome User'); 
    },
    onError: err => console.log(err)
  })

  useEffect(() => {
    console.log('useEff')
    // if(localStorage.getItem('idToken')) {
      console.log('here');
      authenticateUser();
    // }
  }, [localStorage.getItem('idToken')])

  return (
    <div>
      {!user
        ? <h2>Please login to access the dashboard</h2>
        : <>
            <h1>My Teams</h1>
            <TeamList /> 
          </>
      }
    </div>
  );
};

export default DashboardView;
