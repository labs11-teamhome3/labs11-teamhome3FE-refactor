import React, { useState } from 'react';
// import Button from '@material-ui/core/Button';
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
// import Arrow from '@material-ui/icons/ArrowDropDown';
import gql from 'graphql-tag';
import Loader from 'react-loader-spinner';
import Select from '@material-ui/core/Select';
import { FormControl, MenuItem } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';

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
    console.log(e.target.value);
    const selectedChoice = e.target.value
    setChoice(selectedChoice);
    if (selectedChoice === 'all') {
      props.setFilteredEvents(props.allEvents);
    } else {
      props.setFilteredEvents(props.allEvents.filter(event => event.user.name === selectedChoice));
    }
    props.setAnchorEl(null)
  }
  
  const { data, error, loading } = useQuery(TEAM_QUERY, {
    variables: {
      id: props.teamId
    }
  })
  
  let members; 
  let membersOptions = [
    <MenuItem className="member-option" value='' key={Math.random()}></MenuItem>,
    <MenuItem className="member-option" value='all' key={Math.random()}>all</MenuItem>
  ];

  if (data.team) {
    members = data.team.members
    //console.log('members', members)
    membersOptions = [...membersOptions, members.map(member => 
        <MenuItem 
          className="member-option" 
          value={member.name} 
          key={member.id}
        >
        {member.name}
        </MenuItem>
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
      <Loader 
        type="ThreeDots"
        height="25px"
        width="25px"
        color="#0984e3"
      />
    )
  }

  return (
    <div className="filter-by-user label-select">
      <FormControl>
        <InputLabel htmlFor='user-filter'>Filter by user</InputLabel>
          <Select 
            value={choice} 
            onChange={handleSelect}
            inputProps={{
              name: 'filter by user',
              id: "user-filter"
            }}
          >
            {membersOptions}
          
          </Select>
      </FormControl>
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
