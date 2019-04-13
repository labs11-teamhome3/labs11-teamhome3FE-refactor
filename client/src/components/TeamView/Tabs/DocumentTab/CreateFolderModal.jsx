import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import FolderIcon from "@material-ui/icons/Folder";
import TextField from '@material-ui/core/TextField';
import { useMutation } from '../../../../graphQL/useMutation';

import { FOLDERS_QUERY } from '../../../../graphQL/Queries';
import { CREATE_FOLDER } from '../../../../graphQL/Mutations';

const styles = theme => ({
  paper: {
    'max-width': '800px',
    top: '100px',
    margin: '0 auto',
    'text-align': 'left',
    padding: '30px',
  },
  textField: {
    width: '30%'
  },
  createFolder: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '25px'
  },
  button: {
    margin: '10px 0 0 10px'
  }
});

const CreateFolderModal = props => {
    const userId = localStorage.getItem('userId');
    const [title, setTitle] = useState('');

  const handleChange = e => {
    setTitle(e.target.value);
  };

  const [createFolder] = useMutation(CREATE_FOLDER, {
    update: (cache, { data }) => {
      const { findFoldersByTeam } = cache.readQuery({
        query: FOLDERS_QUERY,
        variables: { teamId: props.teamId },
      });
      cache.writeQuery({
        query: FOLDERS_QUERY,
        variables: { teamId: props.teamId },
        data: { findFoldersByTeam: [...findFoldersByTeam, data.createFolder] },
      });
    },
    variables: {
        title: title,
        userId: userId,
        teamId: props.teamId,
    },
    onCompleted: e => {
      props.setMsg('created a folder');
      props.toggleModal('createFolder');
      setTitle('');
    },
    onError: err => console.log(err),
  });

  const { classes } = props;
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.modalStatus}
      >
        <Paper className={classes.paper}>
          <div className={classes.createFolder}>
            <div>
              <FolderIcon />
              <div>Create new folder</div>
            </div>
            <Close onClick={_ => props.toggleModal('createFolder')} />
          </div>
          <br />
          <TextField
            required
            label="Name this folder"
            className={classes.textField}
            value={title}
            onChange={handleChange}
            name="title"
          />
          <Button variant="contained" disabled={!title} className={classes.button} onClick={createFolder}>Create</Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(CreateFolderModal);