import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Arrow from '@material-ui/icons/ArrowDropDown';

const ObjectDropdown = props => {
  const [choice, setChoice] = useState('all');
  //console.log(props);

  const handleSelect = e => {
    const choices = Array.from(e.target);
    //console.log('c', choices);
    const selectedChoice = choices.find(choice => choice.selected).innerText;
    //console.log('s', selectedChoice);
    setChoice(selectedChoice);
    switch(selectedChoice) {
      case 'all':
        props.setFilteredEvents(props.allEvents);
        break;
      case 'added to the team':
        props.setFilteredEvents(props.allEvents.filter(event => event.action_string.includes('to the team')));
        break;
      case 'removed from the team':
        props.setFilteredEvents(props.allEvents.filter(event => event.action_string.includes('from the team')));
        break;
      default:
        props.setFilteredEvents(props.allEvents.filter(event => event.action_string.includes(selectedChoice)));
  }
}

  const activities = [
    {name: 'all'},
    {name: 'created a message'},
    {name: 'added to the team'},
    {name: 'removed from the team'},
    {name: 'created a todo list'},
    {name: 'deleted a todo list'},
    {name: 'completed a todo list'}
  ]

  const activityOptions = activities.map(activity => 
      <option className="activity-option" key={Math.random()}>{activity.name}</option>
    )

  return (
    <div>
      <h2>Filter By Activity</h2>
      <select value={choice} onChange={handleSelect}>
        {activityOptions}
      </select>
    </div>
  )
}

// const ObjectDropdown = props => {
//   const [objectDropdown, setObjectDropdown] = useState(null);

//   const handleOpen = e => {
//     e.preventDefault();
//     setObjectDropdown(e.currentTarget);
//   };

//   const handleClose = e => {
//     console.log(e.target.value);
//     setObjectDropdown(null);
//   };

//   return (
//     <div>
//       <h3>
//         Object:
//         <Button
//           id="object"
//           onClick={handleOpen}
//           aria-owns={objectDropdown ? 'object' : undefined}
//         >
//           All
//           <Arrow />
//         </Button>
//       </h3>
//       <Menu
//         id="object"
//         onClose={handleClose}
//         open={Boolean(objectDropdown)}
//         anchorEl={objectDropdown}
//       >
//         <MenuItem onClick={handleClose}>All</MenuItem>
//         <MenuItem onClick={handleClose}>Message</MenuItem>
//         <MenuItem onClick={handleClose}>Message Comment</MenuItem>
//         <MenuItem onClick={handleClose}>Folder</MenuItem>
//         <MenuItem onClick={handleClose}>Document</MenuItem>
//         <MenuItem onClick={handleClose}>Document Comment</MenuItem>
//         <MenuItem onClick={handleClose}>User</MenuItem>
//       </Menu>
//     </div>
//   );
// };

export default ObjectDropdown;
