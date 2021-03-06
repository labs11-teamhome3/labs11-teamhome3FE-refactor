import React, { useState, useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import DeleteIcon from "@material-ui/icons/Delete";
// import DropArrow from "@material-ui/icons/ArrowDropDown";
import { useMutation } from '../../../../graphQL/useMutation';
import { useQuery } from 'react-apollo-hooks';
// import gql from 'graphql-tag';

import {
  FOLDER_QUERY,
  // USERS_QUERY,
  // MESSAGE_QUERY
} from '../../../../graphQL/Queries';
import { UPDATE_FOLDER } from '../../../../graphQL/Mutations';

const styles = theme => ({
  paper: {
    'max-width': '800px',
    margin: '0 auto',
    'text-align': 'left',
    padding: '20px',
  },
  messageInput: {
    width: '100%',
    marginBottom: '10px',
  },
});

const EditFolderModal = props => {
  const [title, setTitle] = useState('');

  const [updateFolderTitle] = useMutation(UPDATE_FOLDER, {
    variables: {
      folderId: props.folderId,
      title: title,
    },
    onCompleted: e => {
      props.setMsg('updated a folder');
      props.toggleModal('editFolder');
      setTitle('');
    },
    onError: err => console.log(err),
  });

  const folder = useQuery(FOLDER_QUERY, {
    variables: { id: props.folderId },
  });

  useEffect(
    _ => {
      if (folder.data.findFolder !== undefined) {
        setTitle(folder.data.findFolder.title);
      }
    },
    [folder.data]
  );

  const handleChange = e => {
    setTitle(e.target.value);
  };

  const closeModal = _ => {
    props.toggleModal('editFolder');
    setTitle('');
  };

  const { classes } = props;
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.modalStatus}
      >
        <Paper className={classes.paper}>
          <Typography component="h3">Edit Folder Title</Typography>
          <Close onClick={closeModal} />
          <br />
          <input
            type="text"
            value={title}
            onChange={handleChange}
            name="title"
            placeholder="Folder Title"
            className={classes.messageInput}
          />
          <br />
          <Button onClick={updateFolderTitle}>Save</Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(EditFolderModal);
