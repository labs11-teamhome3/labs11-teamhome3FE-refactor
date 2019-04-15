import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import {USERS_QUERY} from '../../graphQL/Queries.js'
import {useQuery} from 'react-apollo-hooks';
import styled from 'styled-components';
import gql from 'graphql-tag'
import { useMutation } from "../../graphQL/useMutation";
import { TEAMS_QUERY } from "../../graphQL/Queries";

const StyledAvatar = styled.img`{
  border-radius: 50%;
  height: 20%;
  width: 15%;
}`

const StyledForm = styled.form`{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
    input {
      border: solid gray 1px;
      margin-bottom: 20px;
      width: 50%;
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



function Form() {
    const userId = localStorage.getItem("userId");
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null)
    const [phone, setPhone] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [teams, setTeams] = useState([]);
    const [editUser] = useMutation(EDIT_USER);


    useEffect(() => {
      if (user) {
        console.log('ue user', user);
        setName(user.name)
        setEmail(user.email)
        setPhone(user.phone)
        setAvatar(user.profilePic)
        setTeams(user.inTeam);
      }
    }, [user && user.name])

    console.log('teams', teams);

    const { data, error, loading } = useQuery(USERS_QUERY);
  
    const teamsQuery = useQuery(TEAMS_QUERY, {
      variables: {
        userId: userId
      }
    })
    if (teamsQuery.data) {
      console.log(teamsQuery.data);
    }

    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Error! {error.message}</div>;
    }
  
    let user = data.users.filter(userData => {
      if (userData.id === userId) return userData
    }); 
    
    user = user[0];
    
      
    
  console.log('form user', user.inTeam);

  return (
    <>
      <StyledAvatar src={user.profilePic} alt="avatar"/>
      <StyledForm>
        <input
          onChange={e => setName(e.target.value)}
          placeholder={user.name}
          name="Name"
        />
        <input
          onChange={e => setPhone(e.target.value)}
          placeholder={
            user.phone ? user.phone : "Add a phone number"
          }
          name="Phone"
        />
        <input
          onChange={e => setEmail(e.target.value)}
          placeholder={user.email}
          name="email"
        />
        {/* <input
          value={avatar}
          onChange={e => setAvatar(e.target.value)}
          placeholder={user.profilePic}
          type="password"
          name="avatar"
          // required
        /> */}
        <button type="submit" onClick={(e) => {
          editUser({variables: {id: userId, name: name, phone: phone, email: email}});
          alert('Info Updated. You will be redirected to team page...')
        }}>Update</button>
        <h2 className="my-teams">My Teams</h2>
        {user.inTeam && user.inTeam.length > 0 &&
          user.inTeam.map(team => 
              <Link to={`/teams/${team.id}/home`}>{team.teamName}</Link>
            )
        }
        {user.inTeam && user.inTeam.length < 1 &&
          <Link to='teams/first-team'>Create a team</Link>
        }
      </StyledForm>
    </>
  );
}

export default Form;