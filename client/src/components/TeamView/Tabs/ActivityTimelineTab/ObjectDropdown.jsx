import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
// import Arrow from '@material-ui/icons/ArrowDropDown';

const ObjectDropdown = props => {
  const [choice, setChoice] = useState("");
  //console.log(props);

  const handleSelect = e => {
    console.log('e', e);
    const choices = Array.from(e.target);
    console.log('c', choices);
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
    props.setOpen(false);
  }

  const activities = [
    {name: ' '},
    {name: 'all'},
    {name: 'created a message'},
    {name: 'added to the team'},
    {name: 'removed from the team'},
    {name: 'created a todo list'},
    {name: 'deleted a todo list'},
    {name: 'completed a todo list'},
    {name: 'changed the team name'}
  ]

  const activityOptions = activities.map(activity => 
      <option className="activity-option" key={activity.name} value={activity.name}>{activity.name}</option>
    )

  return (
    <div className="label-select">
      <label htmlFor="activity-filter">Filter By Activity</label>
      <select id="activity-filter" value={choice} onChange={handleSelect}>
        {activityOptions}
      </select>
    </div>
  )
}

export default ObjectDropdown;
