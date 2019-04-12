import React, { Component, useState } from 'react';
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

const userId = localStorage.getItem("userId");

function getUserData() {

  const { data, error, loading } = useQuery(USERS_QUERY);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  let user = data.users.filter(userData => {
    if (userData.id == userId) return userData
  }); user = user[0];

  return (user)
}

function Form() {

  let user = getUserData();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone);
  const [avatar, setAvatar] = useState(user.profilePic);
  const [editUser] = useMutation(EDIT_USER);

  const teamsQuery = useQuery(TEAMS_QUERY, {
    variables: {
      userId: userId
    }
  })
  if (teamsQuery.data) {
    console.log(teamsQuery.data);
  }

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
        {teamsQuery.data.teamsByUser && teamsQuery.data.teamsByUser.length > 0 &&
          teamsQuery.data.teamsByUser.map(team => 
              <Link to={`/teams/${team.id}/home`}>{team.teamName}</Link>
            )
        }
        {teamsQuery.data.teamsByUser && teamsQuery.data.teamsByUser.length < 1 &&
          <Link to='teams/first-team'>Create a team</Link>
        }
      </StyledForm>
    </>
  );
}

export default Form;
