import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Arrow from '@material-ui/icons/ArrowDropDown';

// queries //
import { USERS_QUERY } from '../../../../graphQL/Queries'
import { useQuery } from "react-apollo-hooks";

const UserDropdown = props => {
  const [choice, setChoice] = useState('all');
  console.log(props);

  const handleSelect = e => {
    const choices = Array.from(e.target);
    console.log('c', choices);
    const selectedChoice = choices.find(choice => choice.selected).innerText;
    console.log('s', selectedChoice);
    setChoice(selectedChoice);
    if (selectedChoice === 'all') {
      props.setFilteredEvents(props.allEvents);
    } else {
      props.setFilteredEvents(props.allEvents.filter(event => event.user.name === selectedChoice));
    }
  }
  
  const { data, error, loading } = useQuery(USERS_QUERY)
  
  let members; 
  let membersOptions = [<option className="member-option" key={Math.random()}>all</option>];
  if (data.users) {
    members = data.users;
    console.log('members', members)
    membersOptions = [...membersOptions, members.map(member => 
        <option className="member-option" key={Math.random()}>{member.name}</option>
      )]
  }

  if (error) {
    return (
      <div>Error</div>
    )
  }

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div>
      <h2>Filter By User</h2>
      <select value={choice} onChange={handleSelect}>
        {membersOptions}
      </select>
    </div>
  )
}

// const UserDropdown = props => {
//   const [userDropdown, setUserDropdown] = useState(null);

//   const handleOpen = e => {
//     e.preventDefault();
//     setUserDropdown(e.currentTarget);
//   };

//   const handleClose = () => {
//     setUserDropdown(null);
//   };

//   return (
//     <div>
//       <h3>
//         User:
//         <Button
//           id="user"
//           onClick={handleOpen}
//           aria-owns={userDropdown ? 'user' : undefined}
//         >
//           All
//           <Arrow />
//         </Button>
//       </h3>
//       <Menu
//         id="user"
//         onClose={handleClose}
//         open={Boolean(userDropdown)}
//         anchorEl={userDropdown}
//       >
//         <MenuItem onClick={handleClose}>All</MenuItem>
//       </Menu>
//     </div>
//   );
// };

export default UserDropdown;
