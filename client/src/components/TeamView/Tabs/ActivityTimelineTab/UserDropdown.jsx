import React, { useState } from 'react';
// import Button from '@material-ui/core/Button';
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
// import Arrow from '@material-ui/icons/ArrowDropDown';
import gql from 'graphql-tag';

// queries //
// import { USERS_QUERY } from '../../../../graphQL/Queries'
import { useQuery } from "react-apollo-hooks";

const TEAM_QUERY = gql`
  query TEAM_QUERY($id: ID!) {
    team(id: $id) {
      id
      members {
        id
        name
      }
    }
  }
`

const UserDropdown = props => {
  const [choice, setChoice] = useState("");
  //console.log('userdd props', props);

  const handleSelect = e => {
    const choices = Array.from(e.target);
    //console.log('c', choices);
    const selectedChoice = choices.find(choice => choice.selected).innerText;
    //console.log('s', selectedChoice);
    setChoice(selectedChoice);
    if (selectedChoice === 'all') {
      props.setFilteredEvents(props.allEvents);
    } else {
      props.setFilteredEvents(props.allEvents.filter(event => event.user.name === selectedChoice));
    }
    props.setOpen(false)
  }
  
  const { data, error, loading } = useQuery(TEAM_QUERY, {
    variables: {
      id: props.teamId
    }
  })
  
  let members; 
  let membersOptions = [
    <option className="member-option" key={Math.random()}></option>,
    <option className="member-option" key={Math.random()}>all</option>
  ];

  if (data.team) {
    members = data.team.members
    //console.log('members', members)
    membersOptions = [...membersOptions, members.map(member => 
        <option className="member-option" key={Math.random()}>{member.name}</option>
      )]
  }

  if (error) {
    console.log(error);
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
    <div className="filter-by-user label-select">
      <label htmlFor="user-filter">Filter By User</label>
      <select id="user-filter" value={choice} onChange={handleSelect}>
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
