import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditPencil from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
import { useMutation } from "../../../../graphQL/useMutation";

import Todo from "./Todo";

const styles = theme => ({
  root: {
    marginBottom: "10px"
  },
  expansionPanelSummary: {
    display: "flex",
    flexDirection: "column"
  },
  completeBtn: {
    marginTop: {}
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
    onCompleted: e => {},
    onError: err => console.log(err)
  });

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>
          {props.todoList.description}
          {props.todoList.completed ? " - Completed" : ""}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelSummary}>
        <h3 onClick={_ => console.log(props.todoList)}>Todos</h3>
        <div>
          {props.todoList.todos.map(todo => (
            <Todo todo={todo} />
          ))}
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={_ => props.toggleModal("edit", props.todoList.id)}
        >
          Edit
        </Button>

        {props.todoList.todos.every(todo => todo.completed === true) &&
        props.todoList.completed === false &&
        props.todoList.todos.length > 0 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={completeTodoList}
          >
            Complete todo list
          </Button>
        ) : null}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default withStyles(styles)(TodoList);
