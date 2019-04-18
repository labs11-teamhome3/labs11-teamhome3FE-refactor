import React, { useState, useEffect } from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import LinearProgress from "@material-ui/core/LinearProgress";
import List from "@material-ui/core/List";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import {
  // MESSAGES_QUERY,
  USERS_QUERY,
  // MESSAGE_QUERY,
  // EVENTS_QUERY,
  TODOS_QUERY,
  TODO_LIST_QUERY
} from "../../../../graphQL/Queries";

// Components //
import Todo from "./Todo";

const styles = theme => ({
  tabHeaderCont: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px"
  },
  title: {
    margin: "0px",
    lineHeight: "35px"
  },
  tabCont: {
    position: "relative"
  },
  expansionPanel: {
    paddingBottom: "15px",
    borderRadius: "4px",
    overflow: "hidden"
  },
  panelTitleCont: {
    display: "flex",
    'flex-wrap': 'wrap',
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 15px"
  },
  progBar: {
    marginBottom: "15px",
    height: "5px"
  }
});

const TodoListPanel = props => {
  const { classes } = props;
  const todoList = useQuery(TODO_LIST_QUERY, {
    variables: { id: props.todoListId }
  });
  const { openPanel, closePanel, panelOpen } = props;
  const normalise = (value, MIN, MAX) => ((value - MIN) * 100) / (MAX - MIN);
  return (
    <ClickAwayListener onClickAway={closePanel}>
      <ExpansionPanel
        expanded={panelOpen}
        style={{ opacity: panelOpen ? 1 : 0, transition: "opacity .3s ease", marginRight: '10px' }}
        className={classes.expansionPanel}
      >
        {todoList.data.todoList && (
          <>
            {console.log(
              "todoListtodos",
              todoList.data.todoList.todos.filter(todo => todo.completed).length
            )}
            <LinearProgress
              variant="determinate"
              className={classes.progBar}
              value={normalise(
                todoList.data.todoList.todos.filter(todo => todo.completed)
                  .length,
                0,
                todoList.data.todoList.todos.length
              )}
            />
            <div className={classes.drawerCont}>
              <div className={classes.panelTitleCont}>
                {console.log(todoList.data)}
                <Typography variant="h4">
                  {todoList.data.todoList.description}
                </Typography>
                <Button
                  color="primary"
                  variant="outlined"
                  className={classes.button}
                  onClick={_ => {
                    props.toggleModal("edit", todoList.data.todoList.id);
                  }}
                >
                  Edit
                </Button>
              </div>
              <List className={classes.todoList}>
                {todoList.data.todoList.todos.map(todo => (
                  <Todo todo={todo} />
                ))}
              </List>
            </div>
          </>
        )}
      </ExpansionPanel>
    </ClickAwayListener>
  );
};

export default withStyles(styles)(TodoListPanel);
