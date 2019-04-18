import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Manaje.png';
import gql from 'graphql-tag';
import { useQuery } from "react-apollo-hooks";
import { TEAMS_QUERY } from "../graphQL/Queries";
import Loader from 'react-loader-spinner';

import './css/Nav.css';

////Components////
import { Button, AppBar } from '../../node_modules/@material-ui/core';
import { isNull } from 'util';

const NavigationView = props => {
  const userId = localStorage.getItem('userId');

  const [firstTeamId, setFirstTeamId] = useState('');

  const { data, error, loading } = useQuery(TEAMS_QUERY, {
    variables: {
      userId: userId
    }
  });

  useEffect ( _ => {
    if (data.teamsByUser && data.teamsByUser.length > 0 && localStorage.getItem('userId')) {
      setFirstTeamId(data.teamsByUser[0].id)
    }
  }, [data.teamsByUser])



  if (loading) {
    return <Loader 
            type="ThreeDots"
            height="25px"
            width="25px"
            color="#0984e3"
          />;
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
              {firstTeamId &&
                <Link to={firstTeamId ? `/teams/${firstTeamId}/home/` : `/teams/first-team`}>
                  {/* {picQuery.data.user && picQuery.data.user.profilePic ? 
                    <img 
                      className="nav-profile-pic" 
                      src={picQuery.data.user.profilePic} 
                      alt="profile" 
                    /> : */}
                    <Button>Home</Button>
                </Link>
              }
              <Button onClick={logout}>Log out</Button>
            </div>
          )}
        </div>
      </AppBar>
    </div>
  );
};

export default NavigationView;