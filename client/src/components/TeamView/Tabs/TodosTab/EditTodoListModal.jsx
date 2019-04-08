import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useMutation } from "../../../../graphQL/useMutation";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Close from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";

/////Components/////

/////Queries/////
import { CREATE_EVENT } from "../../../../graphQL/Mutations";
import {
  MESSAGES_QUERY,
  USERS_QUERY,
  MESSAGE_QUERY,
  EVENTS_QUERY,
  TODOS_QUERY,
  TODO_LIST_QUERY
} from "../../../../graphQL/Queries";

const styles = theme => ({
  paper: {
    "max-width": "800px",
    margin: "0 auto",
    "text-align": "left",
    padding: "20px"
  },
  todoListInput: {
    width: "100%",
    marginBottom: "10px"
  }
});

const CreateTodoListModal = props => {
  const userId = localStorage.getItem("userId");
  const { classes } = props;
  const [todoListTitle, setTodoListTitle] = useState("");
  const todoList = useQuery;

  const handleChange = e => {
    setTodoListTitle(e.target.value);
  };

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.modalStatus}
      >
        <Paper className={classes.paper}>
          <h3>Title</h3>
          <Close onClick={_ => props.toggleModal("edit")} />
          <br />
          <input
            type="text"
            value={todoListTitle}
            onChange={handleChange}
            name="title"
            placeholder="Todo List Title"
            className={classes.todoListInput}
          />
          <br />
          <h3>Todos</h3>
          <input type="text" />
          <Button variant="contained" color="primary">
            Add Todo
          </Button>
          <Button>Save</Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(CreateTodoListModal);
