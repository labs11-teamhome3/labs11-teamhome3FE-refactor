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
import Pencil from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";

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

const UPDATE_TODO = gql`
  mutation UPDATE_TODO(
    $id: String!
    $description: String!
    $completed: Boolean
  ) {
    updateTodo(id: $id, description: $description, completed: $completed) {
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
    width: "100%",
    "&:hover svg": {
      opacity: "1"
    }
  },
  todoTextCont: {
    "&:hover svg": {
      opacity: "1"
    }
  },
  editPencil: {
    opacity: "0"
  }
});

const Todo = props => {
  const { classes } = props;
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(props.todo.description);
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

  const [updateTodo] = useMutation(UPDATE_TODO, {
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
      id: props.todo.id,
      description: description,
      completed: props.todo.completed
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

  const formUpdateTodo = e => {
    e.preventDefault();
    console.log(description);
    updateTodo();
    setEditing(false);
  };

  return (
    <div className={classes.todoCont}>
      <ListItem className={classes.listItem} button>
        {editing ? (
          <>
            <form onSubmit={formUpdateTodo}>
              <TextField
                onChange={e => setDescription(e.target.value)}
                value={description}
              />
            </form>
            <Close onClick={_ => setEditing(false)} />
          </>
        ) : (
          <ListItemText
            primary={
              <span className={classes.todoTextCont}>
                {props.todo.description}{" "}
                <Pencil
                  className={classes.editPencil}
                  onClick={_ => setEditing(true)}
                />
              </span>
            }
          />
        )}
        <ListItemSecondaryAction>
          <Checkbox
            checked={props.todo.completed}
            onChange={toggleComplete}
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
