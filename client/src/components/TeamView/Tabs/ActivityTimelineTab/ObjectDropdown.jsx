import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Arrow from '@material-ui/icons/ArrowDropDown';

const ObjectDropdown = props => {
  const [objectDropdown, setObjectDropdown] = useState(null);

  const handleOpen = e => {
    e.preventDefault();
    setObjectDropdown(e.currentTarget);
  };

  const handleClose = () => {
    setObjectDropdown(null);
  };

  return (
    <div>
      <h3>
        Object:
        <Button
          id="object"
          onClick={handleOpen}
          aria-owns={objectDropdown ? 'object' : undefined}
        >
          All
          <Arrow />
        </Button>
      </h3>
      <Menu
        id="object"
        onClose={handleClose}
        open={Boolean(objectDropdown)}
        anchorEl={objectDropdown}
      >
        <MenuItem onClick={handleClose}>All</MenuItem>
        <MenuItem onClick={handleClose}>Message</MenuItem>
        <MenuItem onClick={handleClose}>Message Comment</MenuItem>
        <MenuItem onClick={handleClose}>Folder</MenuItem>
        <MenuItem onClick={handleClose}>Document</MenuItem>
        <MenuItem onClick={handleClose}>Document Comment</MenuItem>
        <MenuItem onClick={handleClose}>User</MenuItem>
      </Menu>
    </div>
  );
};

export default ObjectDropdown;
