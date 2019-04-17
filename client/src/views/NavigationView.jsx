import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Manaje.png';
import gql from 'graphql-tag';
import { useQuery } from "react-apollo-hooks";
import { TEAMS_QUERY } from "../graphQL/Queries";

import './css/Nav.css';

////Components////
import { Button, AppBar } from '../../node_modules/@material-ui/core';
import { isNull } from 'util';

const userId = localStorage.getItem('userId'); 

// const PIC_QUERY = gql`
//   query PIC_QUERY($id: ID!) {
//     user(id: $id) {
//       id
//       profilePic
//     }
//   }
// `

const NavigationView = props => {

  const { data, error, loading } = useQuery(TEAMS_QUERY, {
    variables: {
      userId: userId
    }
  });


  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }
  // const picQuery = useQuery(PIC_QUERY, {
  //   variables: { id: userId }
  // })

  const login = async () => {
    await props.auth.login();
  };

  const signup = async () => {
    await props.auth.signup();
  };

  const logout = () => {
    props.auth.logout();
  };

  // This makes sure that the home/profile link always works
  const checkTeams = () => {   
    let team; 
    data.teamsByUser ? team = data.teamsByUser.map(team => team.id)[0] : team = localStorage.firstTeamId
    return team
  }

  return (
    <div>
      <AppBar className="header" position="static">
        <div className="header">
          {/* <div className="logo">
              <img className="logo-img" src={logo} alt="Manaje" />
          </div> */}
          {!localStorage.getItem('userId') ? (
            <div className="nav-btns">
              <Button onClick={login}>Log in</Button>
              <Button onClick={signup}>Sign Up</Button>
            </div>
          ) : (
            <div className="nav-btns">
              {/* <Link to="/teams/first-team">
                <Button>Dashboard</Button>
              </Link> */}
              <Link to={`/teams/${ checkTeams() }/home/`}>
                {/* {picQuery.data.user && picQuery.data.user.profilePic ? 
                  <img 
                    className="nav-profile-pic" 
                    src={picQuery.data.user.profilePic} 
                    alt="profile" 
                  /> : */}
                  <Button>Home</Button>
                
              </Link>
              <Button onClick={logout}>Log out</Button>
            </div>
          )}
        </div>
      </AppBar>
    </div>
  );
};

export default NavigationView;