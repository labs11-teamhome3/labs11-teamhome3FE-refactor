import React, { Component } from 'react'
import {USERS_QUERY} from '../../graphQL/Queries.js'
import {useQuery} from 'react-apollo-hooks';
import gql from 'graphql-tag'

const UserInfo = () => {
    const userId = localStorage.getItem("userId");
  
    const { data, error, loading } = useQuery(USERS_QUERY, {
      variables: { id: userId }
    });
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error! {error.message}</div>;
    }
  
    return (
      <div>
          {data.users.map(userData => {
            if (userData.id == userId)
            return ( 
                <p>
                    {userData.name} <br/>
                    {userData.email} <br/>
                    {userData.phone} <br/>
                    {userData.profilePic} <br/>
                </p>
            )
          }
        )}
      </div>
    );
  };
  
export default UserInfo;