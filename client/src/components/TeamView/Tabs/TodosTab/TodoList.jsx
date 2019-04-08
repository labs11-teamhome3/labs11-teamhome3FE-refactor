import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  root: {
    marginBottom: "10px"
  }
});

const TodoList = props => {
  const { classes } = props;
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>
          {props.todoList.description}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <h3>Todos</h3>
        <Button
          variant="contained"
          color="primary"
          onClick={_ => props.toggleModal("edit")}
        >
          Edit
        </Button>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default withStyles(styles)(TodoList);
