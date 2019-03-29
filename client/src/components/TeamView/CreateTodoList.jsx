import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "../../graphQL/useMutation";
import TodoModal from "./TodoListModal";

////Queries////
import { TODOS_QUERY } from "../../graphQL/Queries";
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
  console.log(teamId)
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
      ownedBy: "cjttgie7z00bd0790hfht44st",
      assignedTo: "cjttgie7z00bd0790hfht44st",
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
