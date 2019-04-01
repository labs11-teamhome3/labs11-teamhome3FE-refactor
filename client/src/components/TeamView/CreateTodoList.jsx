import React, { useState } from "react";
import gql from "graphql-tag";
import {useQuery} from 'react-apollo-hooks';
import { useMutation } from "../../graphQL/useMutation";
import TodoModal from "./TodoListModal";

////Queries////
import { TODOS_QUERY, USERS_QUERY } from "../../graphQL/Queries";
import { defaultProps } from "recompose";

const CREATE_TODOLIST = gql`
  mutation CREATE_TODOLIST(
    $description: String!
    $ownedBy: String!
    $assignedTo: String!
    $inTeam: ID
  ) {
    createTodoList(
      description: $description
      ownedBy: $ownedBy
      assignedTo: $assignedTo
      inTeam: $inTeam
    ) {
      id
      description
      todos {
        id
        description
      }
    }
  }
`;

const CreateTodoList = ({ teamId, open, setCreateTodo }) => {
  const users = useQuery(USERS_QUERY);
  console.log(users.loading ? "Loading" : users.data.users[0].id )
  const [todoListInfo, setTodoInfo] = useState({
    description: ""
  });
  const [createTodoList] = useMutation(CREATE_TODOLIST, {
    update: (cache, { data }) => {
      const { todoLists } = cache.readQuery({
        query: TODOS_QUERY,
        variables: { id: teamId }
      });
      cache.writeQuery({
        query: TODOS_QUERY,
        variables: { id: teamId },
        data: { todoLists: [...todoLists, data.createTodoList] }
      });
    },
    variables: {
      description: todoListInfo.description,
      ownedBy: users.loading ? '' : users.data.users[0].id,
      assignedTo: users.loading ? '' : users.data.users[0].id,
      inTeam: teamId
    },
    onCompleted: e => {
      setCreateTodo(false);
    },
    onError: err => console.log(err)
  });

  const handleChange = e => {
    setTodoInfo({
      ...todoListInfo,
      [e.target.name]: e.target.value
    });
  };

  return (
    <TodoModal
      setModal={setCreateTodo}
      handleSubmit={createTodoList}
      todoListInfo={todoListInfo}
      handleChange={handleChange}
      open={open}
    />
  );
};

export default CreateTodoList;
