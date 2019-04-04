import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

////Components////

const styles = theme => ({
  paper: {
    'max-width': '800px',
    margin: '0 auto',
    padding: '20px',
  },
});

const ViewEventModal = props => {
  const { classes } = props;
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.status}
      >
        <Paper className={classes.paper}>
          <Button onClick={props.toggleModal}>Close</Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(ViewEventModal);
