import React, { Component, useState } from 'react'
import {USERS_QUERY} from '../../graphQL/Queries.js'
import {useQuery} from 'react-apollo-hooks';
import styled from 'styled-components';
import gql from 'graphql-tag'
import { useMutation } from "../../graphQL/useMutation";

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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [editUser] = useMutation(EDIT_USER);

  const userId = localStorage.getItem("userId");
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

  return (
    <>
      <StyledAvatar src={user.profilePic} alt="avatar"/>
      <StyledForm>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={user.name}
          // type="text"
          name="Name"
          // required
        />
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder={
            user.phone ? user.phone : "Add a phone number"
          }
          // type="text"
          name="Phone"
          // required
        />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={user.email}
          type="email"
          name="email"
          // required
        />
        {/* <input
          value={avatar}
          onChange={e => setAvatar(e.target.value)}
          placeholder={user.profilePic}
          type="password"
          name="avatar"
          // required
        /> */}
        <button type="submit" onClick={() => {
          editUser({variables: {id: userId, name: name, phone: phone, email: email}});
        }}>Submit</button>
      </StyledForm>
    </>
  );
}

export default Form;
