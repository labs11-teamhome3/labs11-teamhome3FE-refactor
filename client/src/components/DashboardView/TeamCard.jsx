import React from 'react';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    padding: '5px 0px',
    'margin-bottom': '15px',
    background: theme.palette.secondary.main,
  },
  inactive: {
    padding: '5px 0px',
    'margin-bottom': '15px',
    background: theme.palette.primary.light
  }
});

const TeamCard = props => {
  const { classes } = props;
  return (
    <Link className="team-link" to={`/teams/${props.team.id}/home`}>
      <div className={`team-card ${props.team.id === props.match.params.id ?
                        'team-card-active' : null}`}>
        {/* <Paper className={props.team.id === props.match.params.id ?
          classes.root : classes.inactive}> */}
          <div className="team-status">
            <Typography variant="h5" component="h3">
            {props.team.teamName}
            </Typography>
            <div 
              className={`team-premium team-premium-${props.team.premium ? 'premium' : 'basic'}`}
            >
              {props.team.premium ? 'Premium' : 'Basic' }
            </div>
          </div>
        {/* </Paper> */}
      </div>
    </Link>
  );
};

export default withStyles(styles)(TeamCard);
