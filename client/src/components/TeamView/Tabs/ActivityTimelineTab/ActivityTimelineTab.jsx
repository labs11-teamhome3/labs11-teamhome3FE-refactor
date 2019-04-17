import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { withStyles } from '@material-ui/core/styles';

////Components////
import ObjectDropdown from './ObjectDropdown';
import UserDropdown from './UserDropdown';
import Loader from 'react-loader-spinner'
import ViewEventModal from './ViewEventModal';
import { EVENTS_QUERY } from '../../../../graphQL/Queries';
import Event from './Event';
import MoreVert from '@material-ui/icons/MoreVert'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

/// css ///
import './css/ActivityTimeline.css'

const styles = theme => ({
  paper: {
    position: 'absolute',
    zIndex: 1,
    top: '46.8%',
    right: '1%'
  },
  button: {
      width: '100%',
      
  }
});

const ActivityTimeline = props => {
  const [status, setStatus] = useState(false);
  const [allEvents, setAllEvents] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [open, setOpen] = useState(false);

  const events = useQuery(EVENTS_QUERY, {
    variables: {
      teamId: props.teamId,
    },
  });
  //console.log('activity timeline');
  //console.log(events.data.findEventsByTeam);

  /// trying to get filteredEvents array to be the reverse of allEvents, to display most recent event first
  /// right now it's flip flopping on every
  useEffect( _ => {
    setAllEvents(events.data.findEventsByTeam);
    if (events.data.findEventsByTeam) {
      setFilteredEvents(events.data.findEventsByTeam.reverse());
    }
  }, [events.data.findEventsByTeam])

  const toggleModal = () => {
    setStatus(!status);
  };

  const handleClick = () => {
    setOpen(!open);
  }

  const handleClickAway = () => {
    setOpen(false)
  }


  const { classes } = props;

  return (
    <div className="activity-timeline">
      <div className="at-title">
        <h2>Activity</h2>
        {/* <ClickAwayListener onClickAway={handleClickAway}> */}
          <MoreVert className="more-vert" onClick={handleClick}/>
          {open && 
            <Paper className={classes.paper}>
              <Button className={classes.button}>
                <div className="dropdowns">
                  <ObjectDropdown 
                    allEvents={allEvents} 
                    setAllEvents={setAllEvents} 
                    setFilteredEvents={setFilteredEvents}
                    setOpen={setOpen}
                  />
                  <UserDropdown 
                    allEvents={allEvents} 
                    teamId={props.teamId} 
                    setAllEvents={setAllEvents} 
                    setFilteredEvents={setFilteredEvents}
                    setOpen={setOpen}
                  />
                </div>
              </Button>
            </Paper>
            // <div className="dropdowns">
            //   <ObjectDropdown allEvents={allEvents} setAllEvents={setAllEvents} setFilteredEvents={setFilteredEvents}/>
            // </div>
          }
        {/* </ClickAwayListener> */}
      </div>
      {/* <ViewEventModal status={status} toggleModal={toggleModal} /> */}
      <div className="at-events">
        {events.loading &&
          <Loader
            type="ThreeDots"
            height="25px"
            width="25px"
            color="#0984e3"
          
          />
        }
        {events.error &&
          <div>Error fetching events</div>
        }
        {!events.loading && filteredEvents &&
          filteredEvents.map(event => <Event event={event} key={event.id} />)}
      </div>
      {/* <button onClick={toggleModal}>Open Modal</button> */}
    </div>
  );
};

export default withStyles(styles)(ActivityTimeline);
