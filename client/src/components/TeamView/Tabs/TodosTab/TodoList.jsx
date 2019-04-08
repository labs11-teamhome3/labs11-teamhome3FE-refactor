import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    marginBottom: "10px"
  }
});

const TodoList = props => {
  const { classes } = props;
  return (
    <Paper
      elevation={1}
      className={classes.root}
      onClick={_ => props.toggleModal("view", props.todoList.id)}
    >
      <Typography variant="h5" component="h3">
        {props.todoList.description}
      </Typography>
    </Paper>
  );
};

export default withStyles(styles)(TodoList);
