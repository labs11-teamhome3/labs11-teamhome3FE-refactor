import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { FormControl, MenuItem } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
// import Button from '@material-ui/core/Button';
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
// import Arrow from '@material-ui/icons/ArrowDropDown';

const ObjectDropdown = props => {
  const [choice, setChoice] = useState("");
  //console.log(props);

  const handleSelect = e => {
    const selectedChoice = e.target.value
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
    props.setAnchorEl(null);
  }

  const activities = [
    {name: ' '},
    {name: 'all'},
    {name: 'created a message'},
    {name: 'liked a message'},
    {name: 'unliked a message'},
    {name: 'created a todo list'},
    {name: 'deleted a todo list'},
    {name: 'completed a todo list'},
    {name: 'created a document'},
    {name: 'deleted a document'},
    {name: 'updated a document'},
    {name: 'created a folder'},
    {name: 'deleted a folder'},
    {name: 'updated a folder'},
    {name: 'added document to folder'},
    {name: 'removed a document from a folder'},
    {name: 'added to the team'},
    {name: 'removed from the team'},
    {name: 'changed the team name'},
  ]

  const activityOptions = activities.map(activity => 
      <MenuItem 
        className="activity-option" 
        key={activity.name} 
        value={activity.name}
      >
        {activity.name}
      </MenuItem>
    )

  return (
    <div className="label-select">
      <FormControl>
        <InputLabel htmlFor='activty-filter'>Filter by activity</InputLabel>
          <Select 
            value={choice} 
            onChange={handleSelect}
            inputProps={{
              name: 'filter by activity',
              id: "activity-filter"
            }}
          >
            {activityOptions}
          </Select>
      </FormControl>
    </div>
  )
}

export default ObjectDropdown;
