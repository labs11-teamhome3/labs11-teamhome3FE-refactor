import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
// import Fab from "@material-ui/core/Fab";
// import AddIcon from "@material-ui/icons/Add";
import { useMutation } from "../../../../graphQL/useMutation";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Close from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Edit from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";

/////Components/////
import EditTodo from "./EditTodo";

/////Queries/////
// import { CREATE_EVENT } from "../../../../graphQL/Mutations";
import {
  // MESSAGES_QUERY,
  USERS_QUERY,
  // MESSAGE_QUERY,
  // EVENTS_QUERY,
  TODOS_QUERY,
  TODO_LIST_QUERY
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
  deletePopover: {
    padding: "10px"
  },
  popoverButton: {
    width: "50%",
    borderRadius: "0px"
  },
  usersFlex: {},
  todoInputFlex: {
    display: "flex"
  },
  addTodoBtn: {
    lineHeight: "22px",
    marginLeft: "10px"
  },
  bottomBtnCont: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px"
  },
  editModalH4: {
    margin: "0px"
  },
  userH4: {
    margin: "0 0 5px 0"
  },
  section: {
    marginBottom: "30px"
  },
  userChip: {
    marginRight: "5px"
  },
  modalTitleBar: {
    display: "flex",
    justifyContent: "flex-end"
  },
  userBtns: {
    marginTop: "10px"
  },
  closeBtn: {
    cursor: "pointer"
  }
});

const UPDATE_TODO_LIST = gql`
  mutation UPDATE_TODO_LIST(
    $id: String!
    $description: String!
    $completed: Boolean
  ) {
    updateTodoList(id: $id, description: $description, completed: $completed) {
      id
      description
      ownedBy {
        id
        name
      }
      assignedTo {
        id
        name
      }
      todos {
        id
        description
        completed
      }
      completed
    }
  }
`;

const DELETE_TODO_LIST = gql`
  mutation DELETE_TODO_LIST($id: String!) {
    deleteTodoList(id: $id) {
      id
    }
  }
`;

const CREATE_TODO = gql`
  mutation CREATE_TODO(
    $description: String!
    $partOf: ID!
    $completed: Boolean
  ) {
    createTodo(
      description: $description
      partOf: $partOf
      completed: $completed
    ) {
      id
      description
      completed
    }
  }
`;

const ADD_TO_OWNERS = gql`
  mutation ADD_TO_OWNERS($userId: ID!, $todoListId: ID!) {
    addUserToOwners(userId: $userId, todoListId: $todoListId) {
      id
      description
      ownedBy {
        id
        name
      }
      assignedTo {
        id
        name
      }
      todos {
        id
        description
        completed
      }
      completed
    }
  }
`;

const ADD_TO_ASSIGNEES = gql`
  mutation ADD_TO_ASSIGNEES($userId: ID!, $todoListId: ID!) {
    addUserToAssignees(userId: $userId, todoListId: $todoListId) {
      id
      description
      ownedBy {
        id
        name
      }
      assignedTo {
        id
        name
      }
      todos {
        id
        description
        completed
      }
      completed
    }
  }
`;

const REMOVE_FROM_OWNERS = gql`
  mutation REMOVE_FROM_OWNERS($userId: ID!, $todoListId: ID!) {
    removeUserFromOwners(userId: $userId, todoListId: $todoListId) {
      id
      description
      ownedBy {
        id
        name
      }
      assignedTo {
        id
        name
      }
      todos {
        id
        description
        completed
      }
      completed
    }
  }
`;

const REMOVE_FROM_ASSIGNEES = gql`
  mutation REMOVE_FROM_ASSIGNEES($userId: ID!, $todoListId: ID!) {
    removeUserFromAssignees(userId: $userId, todoListId: $todoListId) {
      id
      description
      ownedBy {
        id
        name
      }
      assignedTo {
        id
        name
      }
      todos {
        id
        description
        completed
      }
      completed
    }
  }
`;

const CreateTodoListModal = props => {
  // const userId = localStorage.getItem("userId");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuControl, setMenuControl] = useState("");
  const [editUserId, setEditUserId] = useState({
    id: "",
    action: ""
  });
  const [openPopover, setOpenPopover] = useState(false);
  const { classes } = props;
  const todoList = useQuery(TODO_LIST_QUERY, {
    variables: {
      id: props.todoListId
    }
  });
  const users = useQuery(USERS_QUERY);
  // const [todoListInfo, setTodoListInfo] = useState({
  //   title: "",
  //   newTask: "tesetsetet",
  //   monkey: "monkey monkey"
  // });

  const [todoListTitle, setTodoListTitle] = useState("");
  const [todoListTask, setTodoListTask] = useState("");

  // const handleChange = e => {
  //   setTodoListInfo({
  //     ...todoListInfo
  //   });
  // };

  useEffect(
    _ => {
      if (todoList.data.todoList) {
        setTodoListTitle(todoList.data.todoList.description);
      }
    },
    [todoList.data.todoList]
  );

  useEffect(
    _ => {
      switch (editUserId.action) {
        case "addowner":
          addOwner();
          break;
        case "removeowner":
          removeOwner();
          break;
        case "addassignee":
          addAssignee();
          break;
        case "removeassignee":
          removeAssignee();
          break;
        default:
          break;
      }
    },
    [editUserId]
  );

  const [updateTodoList] = useMutation(UPDATE_TODO_LIST, {
    update: (cache, { data }) => {
      cache.writeQuery({
        query: TODO_LIST_QUERY,
        variables: { id: props.todoListId },
        data: {
          todoList: {
            ...data.updateTodoList
          }
        }
      });
    },
    variables: {
      id: props.todoListId,
      description: todoListTitle
    },
    onCompleted: e => {
      props.toggleModal("edit");
    },
    onError: err => console.log(err)
  });

  const [deleteTodoList] = useMutation(DELETE_TODO_LIST, {
    update: (cache, { data }) => {
      const { todoLists } = cache.readQuery({
        query: TODOS_QUERY,
        variables: { teamId: props.teamId }
      });
      cache.writeQuery({
        query: TODOS_QUERY,
        variables: { teamId: props.teamId },
        data: {
          todoLists: todoLists.filter(
            todoList => todoList.id !== data.deleteTodoList.id
          )
        }
      });
    },
    variables: {
      id: props.todoListId
    },
    onCompleted: e => {
      props.setMsg("deleted a todo list");
      props.toggleModal("edit");
    },
    onError: err => console.log(err)
  });

  const [createTodo] = useMutation(CREATE_TODO, {
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
            todos: [...todoList.todos, data.createTodo]
          }
        }
      });
    },
    variables: {
      description: todoListTask,
      partOf: props.todoListId
    },
    onCompleted: e => {
      setTodoListTask("");
    },
    onError: err => console.log(err)
  });

  const [addOwner] = useMutation(ADD_TO_OWNERS, {
    update: (cache, { data }) => {
      const { todoList } = cache.readQuery({
        query: TODO_LIST_QUERY,
        variables: { id: props.todoListId }
      });
      cache.writeQuery({
        query: TODO_LIST_QUERY,
        variables: { id: props.todoListId },
        data: {
          todoList: { ...data.addUserToOwners }
        }
      });
    },
    variables: {
      userId: editUserId.id,
      todoListId: props.todoListId
    },
    onCompleted: e => {
      setEditUserId({
        id: "",
        action: ""
      });
    },
    onError: err => console.log(err)
  });

  const [addAssignee] = useMutation(ADD_TO_ASSIGNEES, {
    update: (cache, { data }) => {
      const { todoList } = cache.readQuery({
        query: TODO_LIST_QUERY,
        variables: { id: props.todoListId }
      });
      cache.writeQuery({
        query: TODO_LIST_QUERY,
        variables: { id: props.todoListId },
        data: {
          todoList: { ...data.addUserToAssignees }
        }
      });
    },
    variables: {
      userId: editUserId.id,
      todoListId: props.todoListId
    },
    onCompleted: e => {
      setEditUserId({
        id: "",
        action: ""
      });
    },
    onError: err => console.log(err)
  });

  const [removeOwner] = useMutation(REMOVE_FROM_OWNERS, {
    update: (cache, { data }) => {
      const { todoList } = cache.readQuery({
        query: TODO_LIST_QUERY,
        variables: { id: props.todoListId }
      });
      cache.writeQuery({
        query: TODO_LIST_QUERY,
        variables: { id: props.todoListId },
        data: {
          todoList: { ...data.addUserToOwners }
        }
      });
    },
    variables: {
      userId: editUserId.id,
      todoListId: props.todoListId
    },
    onCompleted: e => {
      setEditUserId({
        id: "",
        action: ""
      });
    },
    onError: err => console.log(err)
  });

  const [removeAssignee] = useMutation(REMOVE_FROM_ASSIGNEES, {
    update: (cache, { data }) => {
      const { todoList } = cache.readQuery({
        query: TODO_LIST_QUERY,
        variables: { id: props.todoListId }
      });
      cache.writeQuery({
        query: TODO_LIST_QUERY,
        variables: { id: props.todoListId },
        data: {
          todoList: { ...data.removeUserFromAssignees }
        }
      });
    },
    variables: {
      userId: editUserId.id,
      todoListId: props.todoListId
    },
    onCompleted: e => {
      setEditUserId({
        id: "",
        action: ""
      });
    },
    onError: err => console.log(err)
  });

  const handleClick = (e, menu) => {
    setAnchorEl(e.currentTarget);
    setMenuControl(menu);
  };

  const handleClose = (id, action) => {
    setEditUserId({
      id,
      action
    });
    setAnchorEl(null);
  };

  const handlePopover = e => {
    setAnchorEl(e.currentTarget);
    setOpenPopover(!openPopover);
  };

  const popoverClose = _ => {
    setAnchorEl(null);
    setOpenPopover(!openPopover);
  };

  const popoverDeleteTodoList = _ => {
    popoverClose();
    deleteTodoList();
  };

  if (!todoList.data.todoList) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.modalStatus}
      >
        <Paper className={classes.paper}>
          <div className={classes.modalTitleBar}>
            <Close
              onClick={_ => props.toggleModal("edit")}
              className={classes.closeBtn}
            />
          </div>
          <div className={classes.usersFlex}>
            <div className={classes.section}>
              <div>
                <h4 className={classes.userH4}>Owned by</h4>
                <div>
                  {todoList.data.todoList &&
                    todoList.data.todoList.ownedBy.map(owner => (
                      <Chip
                        label={owner.name}
                        className={classes.userChip}
                        key={owner.id}
                        onDelete={_ =>
                          setEditUserId({ id: owner.id, action: "removeowner" })
                        }
                      />
                    ))}
                </div>
                <div>
                  <Button
                    aria-owns={anchorEl ? "owner-menu" : undefined}
                    aria-haspopup="true"
                    onClick={e => handleClick(e, "owner")}
                    variant="contained"
                    className={classes.userBtns}
                  >
                    Add Owner
                  </Button>
                  <Menu
                    id="owner-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && menuControl === "owner"}
                    onClose={handleClose}
                  >
                    {users.data.users &&
                      users.data.users
                        .filter(user =>
                          user.inTeam.find(team => team.id === props.teamId)
                        )
                        .filter(
                          user =>
                            !todoList.data.todoList.ownedBy.find(
                              obUser => obUser.id === user.id
                            )
                        )
                        .map(user => (
                          <MenuItem
                            key={user.id}
                            onClick={_ => handleClose(user.id, "addowner")}
                          >
                            {user.name}
                          </MenuItem>
                        ))}
                  </Menu>
                </div>
              </div>
            </div>
            <div className={classes.section}>
              <div>
                <h4 className={classes.userH4}>Assigned to</h4>
                <div>
                  {todoList.data.todoList &&
                    todoList.data.todoList.assignedTo.map(assignee => (
                      <Chip
                        label={assignee.name}
                        className={classes.userChip}
                        key={assignee.id}
                        onDelete={_ =>
                          setEditUserId({
                            id: assignee.id,
                            action: "removeassignee"
                          })
                        }
                      />
                    ))}
                </div>
                <div>
                  <Button
                    aria-owns={anchorEl ? "simple-menu" : undefined}
                    aria-haspopup="true"
                    onClick={e => handleClick(e, "assignee")}
                    variant="contained"
                    className={classes.userBtns}
                  >
                    Add Assignee
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && menuControl === "assignee"}
                    onClose={handleClose}
                  >
                    {users.data.users &&
                      users.data.users
                        .filter(user =>
                          user.inTeam.find(team => team.id === props.teamId)
                        )
                        .filter(
                          user =>
                            !todoList.data.todoList.assignedTo.find(
                              obUser => obUser.id === user.id
                            )
                        )
                        .map(user => (
                          <MenuItem
                            key={user.id}
                            onClick={_ => handleClose(user.id, "addassignee")}
                          >
                            {user.name}
                          </MenuItem>
                        ))}
                  </Menu>
                </div>
              </div>
            </div>
          </div>
          <TextField
            type="text"
            value={todoListTitle}
            name="title"
            label="Todo List Title"
            className={classes.todoListInput}
            onChange={e => setTodoListTitle(e.target.value)}
          />
          <h4 className={classes.editModalH4}>Todos</h4>
          <div>
            <List>
              {todoList.data.todoList ? (
                <>
                  {todoList.data.todoList.todos.map((todo, index) => (
                    <EditTodo
                      key={todo.id}
                      todo={todo}
                      todoListId={props.todoListId}
                      divider={
                        !Boolean(
                          index === todoList.data.todoList.todos.length - 1
                        )
                      }
                    />
                  ))}
                </>
              ) : (
                <h2>Loading</h2>
              )}
            </List>
          </div>
          <div className={classes.todoInputFlex}>
            <TextField
              placeholder="Todo Task"
              type="text"
              value={todoListTask}
              onChange={e => setTodoListTask(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={createTodo}
              className={classes.addTodoBtn}
            >
              Add Todo
            </Button>
          </div>
          <div className={classes.bottomBtnCont}>
            <Button onClick={updateTodoList} color="primary" variant="outlined">
              Save
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={handlePopover}
            >
              Delete Todo List
            </Button>
          </div>
          <Popover
            id="simple-popper"
            open={openPopover}
            anchorEl={anchorEl}
            onClose={popoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
          >
            <Typography className={classes.deletePopover}>
              Are you sure you want to delete this Todo List
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              className={classes.popoverButton}
              onClick={popoverDeleteTodoList}
            >
              Delete
            </Button>
            <Button className={classes.popoverButton} onClick={popoverClose}>
              Cancel
            </Button>
          </Popover>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(CreateTodoListModal);
