import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Arrow from '@material-ui/icons/ArrowDropDown';

const ActionDropdown = props => {
  const [actionDropdown, setActionDropdown] = useState(null);

  const handleOpen = e => {
    e.preventDefault();
    setActionDropdown(e.currentTarget);
  };

  const handleClose = () => {
    setActionDropdown(null);
  };

  return (
    <div>
      <h3>
        Action:
        <Button
          id="action"
          onClick={handleOpen}
          aria-owns={actionDropdown ? 'action' : undefined}
        >
          All
          <Arrow />
        </Button>
      </h3>
      <Menu
        id="action"
        onClose={handleClose}
        open={Boolean(actionDropdown)}
        anchorEl={actionDropdown}
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
      </Menu>
    </div>
  );
};

export default ActionDropdown;
