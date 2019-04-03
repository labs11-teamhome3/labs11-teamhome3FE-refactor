import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import { useMutation } from '../../../../graphQL/useMutation';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';

////Components////

const styles = theme => ({
  paper: {
    'max-width': '800px',
    margin: '0 auto',
    padding: '20px',
  },
});

const ViewEventModal = props => {
  // const handleOpen = () => {
  //   setEvent({
  //     open: true
  //   })
  // }

  // const handleClose = () => {
  //   setEvent({
  //     open: false
  //   })
  // }

  return <div />;
};

export default withStyles(styles)(ViewEventModal);
