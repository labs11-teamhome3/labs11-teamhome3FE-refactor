import React from "react";
import gql from "graphql-tag";

import { TODOS_QUERY } from "../../graphQL/Queries";

import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";


const currentUser = localStorage.getItem('userId');
const CREATE_TODO = gql`
  mutation CREATE_TODO(
    $description: String!,
    $partOf: ID!
  ) {
    createTodo(
      description: $description
      partOf: $partOf
    ) {
      id
      description
    }
  }
 `; 

const AddTodos = props => {
  return (
    <div>
      <Button variant="contained" color="primary">
        <AddIcon />
        Add Task
      </Button>
    </div>
  );
};

export default AddTodos;
