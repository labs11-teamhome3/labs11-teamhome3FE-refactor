import React, { useState } from "react";
// import { useQuery } from "react-apollo-hooks";
// import gql from "graphql-tag";
// import Fab from "@material-ui/core/Fab";
// import AddIcon from "@material-ui/icons/Add";
// import { useMutation } from "../../../../graphQL/useMutation";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

/////Components/////
import CreateTodolistModal from "./CreateTodoListModal";
import TodoLists from "./TodoLists";
import EditTodoListModal from "./EditTodoListModal";

/////Queries/////
// import { CREATE_EVENT } from "../../../../graphQL/Mutations";
import // MESSAGES_QUERY,
// USERS_QUERY,
// MESSAGE_QUERY,
// EVENTS_QUERY,
// TODOS_QUERY
"../../../../graphQL/Queries";

const styles = theme => ({
  tabHeaderCont: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px"
  },
  title: {
    margin: "0px",
    lineHeight: "35px"
  }
});

const TodosTab = props => {
  const { classes } = props;
  const [createModalStatus, setCreateModalStatus] = useState(false);
  const [editModalStatus, setEditModalStatus] = useState({
    status: false,
    todoListId: null
  });

  const toggleModal = (modal, todoListId = null) => {
    switch (modal) {
      case "create":
        setCreateModalStatus(!createModalStatus);
        break;

      case "edit":
        setEditModalStatus({
          status: !editModalStatus.status,
          todoListId: todoListId
        });
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <div className={classes.tabHeaderCont}>
        <h1 className={classes.title}>Todo Lists</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={_ => toggleModal("create")}
        >
          Add Todo List
        </Button>
      </div>
      <TodoLists
        teamId={props.teamId}
        toggleModal={toggleModal}
        setMsg={props.setMsg}
      />
      <CreateTodolistModal
        setMsg={props.setMsg}
        teamId={props.teamId}
        modalStatus={createModalStatus}
        toggleModal={toggleModal}
      />
      {editModalStatus.status ? (
        <EditTodoListModal
          setMsg={props.setMsg}
          teamId={props.teamId}
          modalStatus={editModalStatus.status}
          toggleModal={toggleModal}
          todoListId={editModalStatus.todoListId}
        />
      ) : null}
    </div>
  );
};

export default withStyles(styles)(TodosTab);
