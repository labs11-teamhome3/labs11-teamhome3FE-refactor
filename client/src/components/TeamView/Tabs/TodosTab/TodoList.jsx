import React from "react";
// import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Paper from "@material-ui/core/Paper";
import CheckCircle from "@material-ui/icons/CheckCircle";
import LinearProgress from "@material-ui/core/LinearProgress";
// import EditPencil from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
import { useMutation } from "../../../../graphQL/useMutation";

import Todo from "./Todo";

const styles = theme => ({
  root: {
    marginBottom: "10px",
    padding: "10px",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  expansionPanelSummary: {
    display: "flex",
    flexDirection: "column"
  },
  completeBtn: {
    marginTop: {}
  },
  completedTaskText: {
    color: "#00b894",
    transition: "color 0.2s ease"
  },
  completedHeading: {
    color: "#00b894",
    transition: "color 0.2s ease"
  },
  completeIcon: {
    color: "#00b894",
    fontSize: "40px",
    position: "relative",
    top: "2px"
  },
  spacers: {
    width: "25%",
    padding: "0 5px"
  }
});

const COMPLETE_TODO_LIST = gql`
  mutation COMPLETE_TODO_LIST($todoListId: ID!) {
    toggleTodoListComplete(todoListId: $todoListId) {
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

const TodoList = props => {
  const { classes } = props;

  const [completeTodoList] = useMutation(COMPLETE_TODO_LIST, {
    // update: (cache, { data }) => {
    //   const {todoLists} = cache.readQuery({
    //     query: TODOS_QUERY,
    //     variables: { teamId: props.teamId }
    //   });
    //   cache.writeQuery({
    //     query: TODOS_QUERY,
    //     variables: { teamId: props.teamId },
    //     data: { todoLists: [...todoLists, data.createTodoList] }
    //   });
    // },
    variables: {
      todoListId: props.todoList.id
    },
    onCompleted: e => {
      props.setMsg("completed a todo list");
    },
    onError: err => console.log(props.todoList.id)
  });

  const completeaTodoList = e => {
    e.stopPropagation();
    completeTodoList();
  };

  return (
    <div className={classes.spacers}>
      <Paper
        className={classes.root}
        onClick={_ => props.openPanel(props.todoList.id)}
      >
        {/* <LinearProgress
        variant="determinate"
        value={props.normalise(
          props.todoList.todos.filter(todo => todo.completed).length,
          0,
          props.todoList.todos.length
        )}
      /> */}
        <div>
          <Typography
            variant="h6"
            className={props.todoList.completed ? classes.completedHeading : ""}
          >
            {props.todoList.description}
          </Typography>
          <Typography
            className={
              (props.todoList.todos.filter(todo => todo.completed).length ===
                props.todoList.todos.length &&
                props.todoList.todos.filter(todo => todo.completed).length >
                  0) ||
              props.todoList.completed
                ? classes.completedTaskText
                : ""
            }
          >
            {props.todoList.todos.filter(todo => todo.completed).length} /{" "}
            {props.todoList.todos.length} Tasks Completed
          </Typography>
        </div>
        {/* <h3 onClick={_ => console.log(props.todoList)}>Todos</h3> */}
        {/* <div>
          {props.todoList.todos.map(todo => (
            <Todo key={todo.id} todo={todo} />
          ))}
        </div> */}
        {/* <Button
          variant="contained"
          color="primary"
          onClick={_ => props.toggleModal("edit", props.todoList.id)}
        >
          Edit
        </Button> */}
        <div>
          {props.todoList.todos.every(todo => todo.completed === true) &&
          props.todoList.completed === false &&
          props.todoList.todos.length > 0 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={completeaTodoList}
            >
              Complete
            </Button>
          ) : null}
          {props.todoList.completed && (
            <CheckCircle className={classes.completeIcon} />
          )}
        </div>
      </Paper>
    </div>
  );
};

export default withStyles(styles)(TodoList);
