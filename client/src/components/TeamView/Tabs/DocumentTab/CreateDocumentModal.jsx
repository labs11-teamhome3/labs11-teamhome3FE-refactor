import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import File from '@material-ui/icons/InsertDriveFileOutlined';
import { useMutation } from '../../../../graphQL/useMutation';

import { DOCUMENTS_QUERY } from '../../../../graphQL/Queries';
import { CREATE_DOCUMENT } from '../../../../graphQL/Mutations';

const styles = theme => ({
  paper: {
    position: 'relative',
    top: '15%',
    'max-width': '600px',
    margin: '0 auto',
    'text-align': 'left',
    padding: '30px',
  },
  textField: {
    width: '70%',
  },
  createDocument: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '25px',
  },
  button: {
    margin: '10px 0 0',
  },
});

const CreateDocumentModal = props => {
  const userId = localStorage.getItem('userId');
  const [messageInfo, setMessageInfo] = useState({
    title: '',
    textContent: '',
    doc_url: '',
  });

  const handleChange = e => {
    setMessageInfo({
      ...messageInfo,
      [e.target.name]: e.target.value,
    });
  };

  const [createDocument] = useMutation(CREATE_DOCUMENT, {
    update: (cache, { data }) => {
      const { findDocumentsByTeam } = cache.readQuery({
        query: DOCUMENTS_QUERY,
        variables: { teamId: props.teamId },
      });
      cache.writeQuery({
        query: DOCUMENTS_QUERY,
        variables: { teamId: props.teamId },
        data: {
          findDocumentsByTeam: [...findDocumentsByTeam, data.addDocument],
        },
      });
    },
    variables: {
      doc_url: messageInfo.doc_url,
      title: messageInfo.title,
      textContent: messageInfo.textContent,
      userId: userId,
      teamId: props.teamId,
    },
    onCompleted: e => {
      props.setMsg('created a document');
      props.toggleModal('create');
      setMessageInfo({
        title: '',
        content: '',
      });
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
          <div className={classes.createDocument}>
            <div>
              <File />
              <div>Create new file</div>
            </div>
            <Close onClick={_ => props.toggleModal('create')} />
          </div>
          <br />
          <TextField
            required
            label="Name this file"
            value={messageInfo.title}
            onChange={handleChange}
            name="title"
            className={classes.textField}
          />
          <br />
          <TextField
            type="url"
            required
            label="Enter the url of this file"
            value={messageInfo.doc_url}
            onChange={handleChange}
            name="doc_url"
            className={classes.textField}
          />
          <br />
          <TextField
            required
            label="Write about this file"
            multiline
            rowsMax="5"
            name="textContent"
            value={messageInfo.textContent}
            onChange={handleChange}
            className={classes.textField}
            margin="normal"
          />
          <br />
          <Button
            variant="contained"
            disabled={!messageInfo.title && !messageInfo.doc_url}
            className={classes.button}
            onClick={createDocument}
          >
            Create
          </Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(CreateDocumentModal);
