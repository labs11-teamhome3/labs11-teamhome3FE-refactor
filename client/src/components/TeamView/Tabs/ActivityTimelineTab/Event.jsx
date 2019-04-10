import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';

////Components////
import ViewEventModal from './ViewEventModal';

/// css ///
import './css/ActivityTimeline.css'

const styles = theme => ({
  root: {
    marginBottom: '10px',
  },
});

const Event = props => {
  const { classes } = props;
  return (
    <Paper elevation={1} className={classes.root}>
      <Typography variant="h5" component="h3">
      {props.event.user.name} {props.event.action_string}
        <span className="event-createdAt">
          {moment(props.event.createdAt).fromNow()}
        </span>
      </Typography>
    </Paper>
  );
};

export default withStyles(styles)(Event);
