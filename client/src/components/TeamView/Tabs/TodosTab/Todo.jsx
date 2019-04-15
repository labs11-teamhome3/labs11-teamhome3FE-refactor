import React from "react";
import Divider from "@material-ui/core/Divider";
import { useMutation } from "../../../../graphQL/useMutation";
import gql from "graphql-tag";

import { TODO_LIST_QUERY } from "../../../../graphQL/Queries";

import "./TodosTab.css";

const TOGGLE_COMPLETE = gql`
  mutation TOGGLE_COMPLETE($todoId: ID!) {
    toggleTodoComplete(todoId: $todoId) {
      id
      description
      completed
    }
  }
`;

const Todo = props => {
  const [toggleComplete] = useMutation(TOGGLE_COMPLETE, {
    // update: (cache, { data }) => {
    //   const { todoList } = cache.readQuery({
    //     query: TODO_LIST_QUERY,
    //     variables: { id: props.todoListId }
    //   });
    //   cache.writeQuery({
    //     query: TODO_LIST_QUERY,
    //     variables: { id: props.todoListId },
    //     data: {
    //       todoList: {
    //         ...todoList,
    //         todos: todoList.todos.map(todo => {
    //           if (todo.id === props.todo.id) {
    //             return data.toggleTodoComplete;
    //           } else {
    //             return todo;
    //           }
    //         })
    //       }
    //     }
    //   });
    // },
    variables: {
      todoId: props.todo.id
    },
    onCompleted: e => {},
    onError: err => console.log(err)
  });
  return (
    <div className="todo">
      <input
        type="checkbox"
        checked={props.todo.completed}
        onClick={toggleComplete}
        // onChange gets rid of a console warning
        onChange={() => {}}
      />
      <h3>{props.todo.description}</h3>
      <Divider />
    </div>
  );
};

export default Todo;
