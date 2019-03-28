import React from 'react';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    padding: '5px 0px',
    'margin-bottom': '15px'
  },
});

const TeamCard = props => {
  const { classes } = props;
  return (
    <Link to={`/teams/${props.team.id}/home`}>
      <div>
        <Paper className={classes.root}>
        <Typography variant="h5" component="h3">
        {props.team.teamName}
        </Typography>
        </Paper>
      </div>
    </Link>
  );
};

export default withStyles(styles)(TeamCard);
