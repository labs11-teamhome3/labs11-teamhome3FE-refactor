import React from "react";
import Divider from "@material-ui/core/Divider";
// import EditPencil from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { useMutation } from "../../../../graphQL/useMutation";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";

import "./TodosTab.css";

import { TODO_LIST_QUERY } from "../../../../graphQL/Queries";

const DELETE_TODO = gql`
  mutation DELETE_TODO($id: String!) {
    deleteTodo(id: $id) {
      id
    }
  }
`;

const styles = theme => ({
  todoCont: {
    width: "100%"
  },
  listItem: {
    width: "100%",
    cursor: 'default'
  },
  delete: {
    cursor: 'pointer'
  }
});

const Todo = props => {
  const {classes} = props;
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
    <div className={classes.todoCont}>
    <ListItem
      className={classes.listItem}
      button
    >
      <ListItemText primary={props.todo.description} />
      <ListItemSecondaryAction>
      <DeleteIcon onClick={deleteTodo} className={classes.delete} />
      </ListItemSecondaryAction>
    </ListItem>
    {props.divider && <Divider />}
  </div>
  );
};

export default withStyles(styles)(Todo);
