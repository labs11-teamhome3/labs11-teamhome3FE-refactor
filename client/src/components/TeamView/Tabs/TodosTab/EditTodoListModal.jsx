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

const CreateTodoListModal = props => {
  const userId = localStorage.getItem("userId");
  const { classes } = props;
  const todoList = useQuery(TODO_LIST_QUERY, {
    variables: {
      id: props.todoListId
    }
  });
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
                <Chip label={owner.name} key={owner.id} />
              ))}
          </div>
          <h4 onClick={_ => console.log(props)}>Assigned to</h4>
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
