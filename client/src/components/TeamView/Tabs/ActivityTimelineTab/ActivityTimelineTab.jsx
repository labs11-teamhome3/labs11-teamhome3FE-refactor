import React, { useState } from 'react';

////Components////
import Events from './Events';
import ObjectDropdown from './ObjectDropdown';
import ActionDropdown from './ActionDropdown';
import UserDropdown from './UserDropdown';

const ActivityTimeline = props => {
  const [status, setStatus] = useState();

  const toggleModal = () => {
    setStatus(!status);
  };

  return (
    <div>
      <h1>Activity</h1>
      <ObjectDropdown />
      <ActionDropdown />
      <UserDropdown />
    </div>
  );
};

export default ActivityTimeline;
