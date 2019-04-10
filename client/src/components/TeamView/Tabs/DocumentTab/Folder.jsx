import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    marginBottom: "10px"
  }
});

const Folder = props => {
  const { classes } = props;
  //console.log('folder props', props);
  return (
    <Paper
      elevation={1}
      className={classes.root}
      onClick={_ => props.toggleModal('viewFolder', props.folder.id)}
    >
      <Typography variant="h5" component="h3">
        {props.folder.title}
      </Typography>
    </Paper>
  );
};

export default withStyles(styles)(Folder);