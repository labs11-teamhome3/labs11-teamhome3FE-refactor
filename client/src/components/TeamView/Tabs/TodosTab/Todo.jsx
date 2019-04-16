import React, { useState } from "react";
import Divider from "@material-ui/core/Divider";
import { useMutation } from "../../../../graphQL/useMutation";
import gql from "graphql-tag";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";

// import { TODO_LIST_QUERY } from "../../../../graphQL/Queries";

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

const styles = theme => ({
  todoCont: {
    width: "100%"
  },
  listItem: {
    width: "100%"
  }
});

const Todo = props => {
  const { classes } = props;
  const [todoComplete, setTodoComplete] = useState(props.todo.completed);
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
    onCompleted: e => {
      if (e.toggleTodoComplete.completed) {
        props.setCompleteTodos(props.completeTodos + 1);
      } else {
        props.setCompleteTodos(props.completeTodos - 1);
      }
    },
    onError: err => console.log(err)
  });

  const listToggleComplete = _ => {
    toggleComplete();
    setTodoComplete(!todoComplete);
  };
  return (
    <div className={classes.todoCont}>
      <ListItem
        className={classes.listItem}
        onClick={listToggleComplete}
        button
      >
        <ListItemText primary={props.todo.description} />
        <ListItemSecondaryAction>
          <Checkbox
            checked={todoComplete}
            onChange={_ => setTodoComplete(!todoComplete)}
            onClick={toggleComplete}
            value="checkedB"
            color="primary"
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </div>
  );
};

export default withStyles(styles)(Todo);
