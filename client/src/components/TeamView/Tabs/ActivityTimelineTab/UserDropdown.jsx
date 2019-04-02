import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Arrow from '@material-ui/icons/ArrowDropDown';

const UserDropdown = props => {
  const [userDropdown, setUserDropdown] = useState(null);

  const handleOpen = e => {
    e.preventDefault();
    setUserDropdown(e.currentTarget);
  };

  const handleClose = () => {
    setUserDropdown(null);
  };

  return (
    <div>
      <h3>
        User:
        <Button
          id="user"
          onClick={handleOpen}
          aria-owns={userDropdown ? 'user' : undefined}
        >
          All
          <Arrow />
        </Button>
      </h3>
      <Menu
        id="user"
        onClose={handleClose}
        open={Boolean(userDropdown)}
        anchorEl={userDropdown}
      >
        <MenuItem onClick={handleClose}>All</MenuItem>
      </Menu>
    </div>
  );
};

export default UserDropdown;
