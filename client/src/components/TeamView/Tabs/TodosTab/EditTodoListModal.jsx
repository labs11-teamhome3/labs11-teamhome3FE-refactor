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
import Chip from "@material-ui/core/Chip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

/////Components/////
import EditTodo from "./EditTodo";

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
  const userId = localStorage.getItem("userId");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuControl, setMenuControl] = useState("");
  const [editUserId, setEditUserId] = useState({
    id: "",
    action: ""
  });
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
      console.log(editUserId);
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
      }
    },
    [editUserId]
  );

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
          <Close onClick={_ => props.toggleModal("edit")} />
          <h4>Owned by</h4>
          <div>
            {todoList.data.todoList &&
              todoList.data.todoList.ownedBy.map(owner => (
                <Chip
                  label={owner.name}
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
          <h4 onClick={_ => console.log(props)}>Assigned to</h4>
          <div>
            {todoList.data.todoList &&
              todoList.data.todoList.assignedTo.map(assignee => (
                <Chip 
                label={assignee.name} 
                key={assignee.id} 
                onDelete={_ =>
                  setEditUserId({ id: assignee.id, action: "removeassignee" })
                }
                />
              ))}
          </div>
          <div>
            <Button
              aria-owns={anchorEl ? "simple-menu" : undefined}
              aria-haspopup="true"
              onClick={e => handleClick(e, "assignee")}
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
                    <MenuItem key={user.id} onClick={_ => handleClose(user.id, "addassignee")}>
                      {user.name}
                    </MenuItem>
                  ))}
            </Menu>
          </div>
          <h3>Title</h3>
          <br />
          <input
            type="text"
            value={todoListTitle}
            name="title"
            placeholder="Todo List Title"
            className={classes.todoListInput}
            onChange={e => setTodoListTitle(e.target.value)}
          />
          <br />
          <h3>Todos</h3>
          <div>
            {todoList.data.todoList ? (
              <>
                {todoList.data.todoList.todos.map(todo => (
                  <EditTodo
                    key={todo.id}
                    todo={todo}
                    todoListId={props.todoListId}
                  />
                ))}
              </>
            ) : (
              <h2>Loading</h2>
            )}
          </div>
          <input
            type="text"
            value={todoListTask}
            onChange={e => setTodoListTask(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={createTodo}>
            Add Todo
          </Button>
          <Button>Save</Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(CreateTodoListModal);
