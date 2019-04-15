import React from "react";
import Divider from "@material-ui/core/Divider";
// import EditPencil from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { useMutation } from "../../../../graphQL/useMutation";
import gql from "graphql-tag";

import "./TodosTab.css";

import { TODO_LIST_QUERY } from "../../../../graphQL/Queries";

const DELETE_TODO = gql`
  mutation DELETE_TODO($id: String!) {
    deleteTodo(id: $id) {
      id
    }
  }
`;

const Todo = props => {
  const [deleteTodo] = useMutation(DELETE_TODO, {
    update: (cache, { data }) => {
      const { todoList } = cache.readQuery({
        query: TODO_LIST_QUERY,
        variables: { id: props.todoListId }
      });
      cache.writeQuery({
        query: TODO_LIST_QUERY,
        variables: { id: props.todoListId },
        data: {
          todoList: {
            ...todoList,
            todos: todoList.todos.filter(todo => todo.id !== props.todo.id)
          }
        }
      });
    },
    variables: {
      id: props.todo.id
    },
    onCompleted: e => {},
    onError: err => console.log(err)
  });
  return (
    <div className="todo edit">
      <h3>
        {props.todo.description}
        <DeleteIcon onClick={deleteTodo} />
      </h3>
      <Divider />
    </div>
  );
};

export default Todo;
