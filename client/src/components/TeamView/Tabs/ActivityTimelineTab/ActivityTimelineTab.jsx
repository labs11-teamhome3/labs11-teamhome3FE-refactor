import React, { useState } from 'react';
import { useQuery } from 'react-apollo-hooks';

////Components////
import ObjectDropdown from './ObjectDropdown';
import ActionDropdown from './ActionDropdown';
import UserDropdown from './UserDropdown';
import ViewEventModal from './ViewEventModal';
import { EVENTS_QUERY } from '../../../../graphQL/Queries';
import Event from './Event';

const ActivityTimeline = props => {
  const [status, setStatus] = useState(false);

  const events = useQuery(EVENTS_QUERY, {
    variables: {
      teamId: props.teamId,
    },
  });
  console.log('activity timeline');
  console.log(events.data.findEventsByTeam);

  const toggleModal = () => {
    setStatus(!status);
  };

  return (
    <div>
      <h1>Activity</h1>
      <ObjectDropdown />
      <ActionDropdown />
      <UserDropdown />
      <ViewEventModal status={status} toggleModal={toggleModal} />
      <div>
        {!events.loading &&
          events.data.findEventsByTeam.map(event => <Event event={event} key={event.id} />)}
      </div>
      <button onClick={toggleModal}>Open Modal</button>
    </div>
  );
};

export default ActivityTimeline;
