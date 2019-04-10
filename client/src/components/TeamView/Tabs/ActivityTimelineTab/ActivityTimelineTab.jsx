import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo-hooks';

////Components////
import ObjectDropdown from './ObjectDropdown';
import ActionDropdown from './ActionDropdown';
import UserDropdown from './UserDropdown';
import ViewEventModal from './ViewEventModal';
import { EVENTS_QUERY } from '../../../../graphQL/Queries';
import Event from './Event';

/// css ///
import './css/ActivityTimeline.css'

const ActivityTimeline = props => {
  const [status, setStatus] = useState(false);
  const [allEvents, setAllEvents] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const events = useQuery(EVENTS_QUERY, {
    variables: {
      teamId: props.teamId,
    },
  });
  console.log('activity timeline');
  console.log(events.data.findEventsByTeam);

  /// trying to get filteredEvents array to be the reverse of allEvents, to display most recent event first
  /// right now it's flip flopping on every
  useEffect( _ => {
    setAllEvents(events.data.findEventsByTeam);
    setFilteredEvents(events.data.findEventsByTeam);
  }, [events.data.findEventsByTeam])

  const toggleModal = () => {
    setStatus(!status);
  };

  return (
    <div className="activity-timeline">
      <h1 className="at-title">Event Timeline</h1>
      <div className="dropdowns">
        <ObjectDropdown allEvents={allEvents} setAllEvents={setAllEvents} setFilteredEvents={setFilteredEvents}/>
        {/* <ActionDropdown /> */}
        <UserDropdown allEvents={allEvents} teamId={props.teamId} setAllEvents={setAllEvents} setFilteredEvents={setFilteredEvents}/>
      </div>
      <ViewEventModal status={status} toggleModal={toggleModal} />
      <div>
        {!events.loading && filteredEvents &&
          filteredEvents.map(event => <Event event={event} key={event.id} />)}
      </div>
      {/* <button onClick={toggleModal}>Open Modal</button> */}
    </div>
  );
};

export default ActivityTimeline;
