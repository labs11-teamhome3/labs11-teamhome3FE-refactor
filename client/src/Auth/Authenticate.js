import React from 'react';
import gql from 'graphql-tag';

import {useMutation} from "../graphQL/useMutation";

const Authenticate = props => {
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
  
  const [authenticateUser] = useMutation(AUTHENTICATE_USER, {
    variables: {
      authId: localStorage.getItem('authId')
    },
    onCompleted: e => {
      alert('Weclome User'); 
    },
    onError: err => console.log(err)
  })
}

export default Authenticate; 