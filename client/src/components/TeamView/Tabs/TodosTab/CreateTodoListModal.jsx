import React, { useState } from "react";
// import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
// import Fab from "@material-ui/core/Fab";
// import AddIcon from "@material-ui/icons/Add";
import { useMutation } from "../../../../graphQL/useMutation";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Close from "@material-ui/icons/Close";
import List from "@material-ui/icons/List";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

/////Components/////

/////Queries/////
// import { CREATE_EVENT } from "../../../../graphQL/Mutations";
import {
  // MESSAGES_QUERY,
  // USERS_QUERY,
  // MESSAGE_QUERY,
  // EVENTS_QUERY,
  TODOS_QUERY
} from "../../../../graphQL/Queries";

const styles = theme => ({
  paper: {
    position: "relative",
    top: "24%",
    "max-width": "600px",
    margin: "0 auto",
    "text-align": "left",
    padding: "30px"
  },
  todoListInput: {
    width: "100%",
    marginBottom: "10px"
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  closeBtn: {
    cursor: "pointer"
  }
});

const CREATE_TODOLIST = gql`
  mutation CREATE_TODOLIST(
    $description: String!
    $ownedBy: String!
    $inTeam: ID
  ) {
    createTodoList(
      description: $description
      ownedBy: $ownedBy
      inTeam: $inTeam
    ) {
      id
      description
      completed
      todos {
        id
        description
        completed
      }
    }
  }
`;

const CreateTodoListModal = props => {
  const userId = localStorage.getItem("userId");
  const { classes } = props;
  const [todoListTitle, setTodoListTitle] = useState("");
  const [createTodoList] = useMutation(CREATE_TODOLIST, {
    update: (cache, { data }) => {
      const { todoLists } = cache.readQuery({
        query: TODOS_QUERY,
        variables: { teamId: props.teamId }
      });
      cache.writeQuery({
        query: TODOS_QUERY,
        variables: { teamId: props.teamId },
        data: { todoLists: [...todoLists, data.createTodoList] }
      });
    },
    variables: {
      description: todoListTitle,
      ownedBy: userId,
      inTeam: props.teamId
    },
    onCompleted: e => {
      setTodoListTitle("");
      props.setMsg("created a todo list");
      props.toggleModal("edit", e.createTodoList.id);
      props.toggleModal("create");
    },
    onError: err => console.log(err)
  });

  const handleChange = e => {
    setTodoListTitle(e.target.value);
  };

  const createTodoPD = e => {
    e.preventDefault();
    createTodoList();
  };

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.modalStatus}
      >
        <Paper className={classes.paper}>
          <div className={classes.modalHeader}>
            <List />
            <Close
              onClick={_ => props.toggleModal("create")}
              className={classes.closeBtn}
            />
          </div>
          <br />
          <form onSubmit={createTodoPD}>
            <TextField
              required
              value={todoListTitle}
              onChange={handleChange}
              name="title"
              label="Todo List Title"
              className={classes.todoListInput}
            />
            <br />
            <Button onClick={createTodoPD}>Save</Button>
          </form>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(CreateTodoListModal);
