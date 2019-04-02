import React, { useState } from 'react';
// import Button from '@material-ui/core/Button';
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
// import Arrow from '@material-ui/icons/ArrowDropDown';

////Components////
import ObjectDropdown from './ObjectDropdown';
import ActionDropdown from './ActionDropdown';
import UserDropdown from './UserDropdown';

const Activity = props => {
  // const [dropdown, setDropdown] = useState(null);

  // const handleOpen = e => {
  //   e.preventDefault();
  //   console.log(e.currentTarget.id);
  //   setDropdown(e.currentTarget);
  // };

  // const handleClose = () => {
  //   setDropdown(null);
  // };

  return (
    <div>
      <ObjectDropdown />
      <ActionDropdown />
      <UserDropdown />
      {/* <h3>
        Object:
        <Button
          id="object"
          onClick={handleOpen}
          aria-owns={
            dropdown && dropdown.id === 'object' ? 'object' : undefined
          }
        >
          All
          <Arrow />
        </Button>
      </h3> */}
      {/* <h3>
        Action:
        <Button
          id="action"
          onClick={handleOpen}
          aria-owns={
            dropdown && dropdown.id === 'action' ? 'action' : undefined
          }
        >
          All
          <Arrow />
        </Button>
      </h3> */}
      {/* <h3>
        User:
        <Button
          id="user"
          onClick={handleOpen}
          aria-owns={dropdown && dropdown.id === 'user' ? 'user' : undefined}
        >
          All
          <Arrow />
        </Button>
      </h3> */}
      {/* <Menu
        id="object"
        onClose={handleClose}
        open={Boolean(dropdown)}
        anchorEl={dropdown}
      >
        <MenuItem onClick={handleClose}>All</MenuItem>
        <MenuItem onClick={handleClose}>Message</MenuItem>
        <MenuItem onClick={handleClose}>Message Comment</MenuItem>
        <MenuItem onClick={handleClose}>Folder</MenuItem>
        <MenuItem onClick={handleClose}>Document</MenuItem>
        <MenuItem onClick={handleClose}>Document Comment</MenuItem>
        <MenuItem onClick={handleClose}>User</MenuItem>
      </Menu> */}
      {/* <Menu
        id="action"
        onClose={handleClose}
        open={Boolean(dropdown)}
        anchorEl={dropdown}
      >
        <MenuItem onClick={handleClose}>All</MenuItem>
        <MenuItem onClick={handleClose}>Added</MenuItem>
        <MenuItem onClick={handleClose}>Created</MenuItem>
        <MenuItem onClick={handleClose}>Edited</MenuItem>
        <MenuItem onClick={handleClose}>Deleted</MenuItem>
        <MenuItem onClick={handleClose}>Liked</MenuItem>
        <MenuItem onClick={handleClose}>Unliked</MenuItem>
        <MenuItem onClick={handleClose}>Joined</MenuItem>
        <MenuItem onClick={handleClose}>Left</MenuItem>
        <MenuItem onClick={handleClose}>Moved</MenuItem>
        <MenuItem onClick={handleClose}>Subscribed to</MenuItem>
        <MenuItem onClick={handleClose}>Unsubscribed from</MenuItem>
        <MenuItem onClick={handleClose}>Invited</MenuItem>
        <MenuItem onClick={handleClose}>Updated</MenuItem>
        <MenuItem onClick={handleClose}>Removed</MenuItem>
      </Menu> */}
      {/* <Menu
        id="user"
        onClose={handleClose}
        open={Boolean(dropdown)}
        anchorEl={dropdown}
      >
        <MenuItem onClick={handleClose}>All</MenuItem>
      </Menu> */}
    </div>
  );
};

export default Activity;
