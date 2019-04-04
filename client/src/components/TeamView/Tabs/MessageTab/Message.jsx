import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    marginBottom: "10px"
  }
});

const Message = props => {
  const { classes } = props;
  return (
    <Paper
      elevation={1}
      className={classes.root}
      onClick={_ => props.toggleModal('view', props.message.id)}
    >
      <Typography variant="h5" component="h3">
        {props.message.title} - {props.message.creator.name}
      </Typography>
    </Paper>
  );
};

export default withStyles(styles)(Message);