import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import {USERS_QUERY} from '../../graphQL/Queries.js'
import {useQuery} from 'react-apollo-hooks';
import styled from 'styled-components';
import gql from 'graphql-tag'
import { useMutation } from "../../graphQL/useMutation";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { TEAMS_QUERY } from "../../graphQL/Queries";

const StyledAvatar = styled.img`{
  border-radius: 50%;
  height: 20%;
  width: 12%;
  margin-bottom: 10px;
  // border: solid blue 2px;
}`

const StyledHeader = styled.h2`{
  margin-right: 300px;
}`

const StyledContainer = styled.div`{
  // border: solid green 2px;
  display: flex;
  justify-content: center;
}`

const StyledTeams = styled.div`{
  // border: solid gray 1px;
  display: flex;
  margin-left: 25px;
  flex-direction: column;
}`

const StyledForm = styled.form`{
  display: flex;
  // border: solid red 2px;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  margin-left: 25px;
    button {
      align-self: flex-end;
      margin-bottom: 10px;
    }
    input {
      border: solid gray 1px;
      padding: 0px;
      margin-bottom: 20px;
      width: 300px;
      height: 50px;
      border-radius: 15px;
        ::placeholder {
          padding-left: 10px;
        }
    }
}`

const EDIT_USER = gql`
  mutation EditUser($id: ID!, $name: String, $email: String, $phone: String) {
    updateUserContactInfo(id: $id, name: $name, email: $email, phone: $phone) {
      name
      email
      phone
    }
  }
`;


function Form(props) {
    const userId = localStorage.getItem("userId");
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null)
    const [phone, setPhone] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [teams, setTeams] = useState([]);
    const [editUser] = useMutation(EDIT_USER);


    useEffect(() => {
      if (user) {
        setName(user.name)
        setEmail(user.email)
        setPhone(user.phone)
        setAvatar(user.profilePic)
        setTeams(user.inTeam);
      }
    }, [user && user.name])


    const { data, error, loading } = useQuery(USERS_QUERY);

    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Error! {error.message}</div>;
    }
    let user = data.users.filter(userData => userData.id === userId); 
    user = user[0];
    
  return (
    <>
    <Paper>
      <StyledHeader>User Settings</StyledHeader>
      <StyledContainer>
        <StyledAvatar src={user.profilePic} alt="avatar"/>

        <StyledForm>
          <input
            onChange={e => setName(e.target.value)}
            placeholder={` Name: ${user.name}`}
            name="Name"
          />
          <input
            onChange={e => setPhone(e.target.value)}
            placeholder={
              user.phone ? `Phone: ${user.phone}` : "Add a phone number"
            }
            name="Phone"
          />
          <input
            onChange={e => setEmail(e.target.value)}
            placeholder={`Contact Email: ${user.email}`}
            name="email"
          />
          <Button variant="outlined" color="primary" type="submit" onClick={(e) => {
              editUser({variables: {
                id: userId, 
                name: name ? name : user.name, 
                phone: phone ? phone : user.phone, 
                email: email ? email : user.email
              }});
            }}> Update
          </Button>
        </StyledForm>

      </StyledContainer>
      </Paper>

        <StyledTeams>
          <StyledHeader>My Teams</StyledHeader>
            {user.inTeam && user.inTeam.length > 0 &&
              user.inTeam.map(team => 
                  <Link to={`/teams/${team.id}/home`}>{team.teamName}</Link>
                )
            }
            {user.inTeam && user.inTeam.length < 1 &&
              <Link to='teams/first-team'>Create a team</Link>
            }
        </StyledTeams>
        <StyledTeams>
          <StyledHeader>My Activity</StyledHeader>
            {user.events && 
              user.events.map(event => {
                return (
                  <p> 
                    {event.action_string} in {event.team.teamName}
                  </p>)
              })
            }
        </StyledTeams>
  </>
  );
}

export default Form;