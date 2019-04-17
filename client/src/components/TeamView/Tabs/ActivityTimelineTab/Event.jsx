import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';

////Components////
// import ViewEventModal from './ViewEventModal';

/// css ///
import './css/ActivityTimeline.css'

const styles = theme => ({
  root: {
    marginBottom: '10px',
  },
});

const Event = props => {
  // const { classes } = props;
  return (
      <div className={`event `}>
        <img className="user-pic" src={props.event.user.profilePic} alt="pic" />
        <div className="event-info">
          <span className={`event-activity`}>
            <span className="event-user">{`${props.event.user.name} `}</span>
            {/* <span className={`${props.event.action_string.split(' ')[0]}`}>{props.event.action_string}</span> */}
            <span className='event-action'>{props.event.action_string}</span>
          </span>
          <span className="event-createdAt">
            {moment(props.event.createdAt).fromNow()}
          </span>
        </div>
      </div>
  );
};

export default withStyles(styles)(Event);
