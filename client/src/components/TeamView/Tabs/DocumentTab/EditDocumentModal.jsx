import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import File from '@material-ui/icons/InsertDriveFileOutlined';
import { useMutation } from "../../../../graphQL/useMutation";
import { useQuery } from "react-apollo-hooks";
// import gql from 'graphql-tag';

import {DOCUMENT_QUERY} from '../../../../graphQL/Queries';
import {UPDATE_DOCUMENT} from '../../../../graphQL/Mutations';

const styles = theme => ({
  paper: {
    position: 'relative',
    overflow: 'auto',
    top: '15%',
    'max-width': '400px',
    margin: '0 auto',
    'text-align': 'left',
    padding: '30px',
  },
  textField: {
    width: '90%'
  },
  editDocument: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '25px'
  },
  button: {
    margin: '10px 0 0'
  },
  commentInput: {
    width: "100%"
  }
});

const EditDocumentModal = props => {
  const [messageInfo, setMessageInfo] = useState({
    title: '',
    textContent: '',
    doc_url: ''
  });

  const [updateDocument] = useMutation(UPDATE_DOCUMENT, {
    variables: {
      documentId: props.documentId,
      title: messageInfo.title,
      textContent: messageInfo.textContent,
      doc_url: messageInfo.doc_url
    },
    onCompleted: e => {
      props.setMsg('updated a document')
      props.toggleModal('edit');
      setMessageInfo({
        title: '',
        textContent: '',
        doc_url: ''
      })
    },
    onError: err => console.log(err)
  });

  const document = useQuery(DOCUMENT_QUERY, {
    variables: {id: props.documentId}
  })

  useEffect(_ => {
    if(document.data.findDocument !== undefined) {
      setMessageInfo({
        title: document.data.findDocument.title,
        textContent: document.data.findDocument.textContent,
        doc_url: document.data.findDocument.doc_url
      })
    }
  }, [document.data])

  const handleChange = e => {
    setMessageInfo({
      ...messageInfo,
      [e.target.name]: e.target.value
    });
  };

  const closeModal = _ => {
    props.toggleModal('edit')
    setMessageInfo({
        title: '',
        textContent: '',
        doc_url: ''
    })
  }

  const { classes } = props;
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.modalStatus}
      >
        <Paper className={classes.paper}>
          <div className={classes.editDocument}>
            <div>
              <File />
              <div>Edit Document</div>
            </div>
            <Close onClick={closeModal} />
          </div>
          <br />
          <TextField
            value={messageInfo.title}
            onChange={handleChange}
            name="title"
            placeholder="Message Title"
            className={classes.textField}
          />
          <br />
          <TextField 
            value={messageInfo.doc_url}
            onChange={handleChange}
            name="doc_url"
            placeholder="Document URL"
            className={classes.textField}
          />
          <br />
          <TextField
            name="textContent"
            onChange={handleChange}
            multiline
            rowsMax="5"
            margin="normal"
            value={messageInfo.textContent}
            placeholder="Write about this file"
            className={classes.textField}
          />
          <br />
          <Button 
            variant="contained" 
            disabled={
              props.ModalStatus &&
              messageInfo.title &&
              messageInfo.title === document.data.findDocument.title &&
              messageInfo.doc_url === document.data.findDocument.doc_url &&
              messageInfo.textContent === document.data.findDocument.textContent
            }
            className={classes.button} 
            onClick={updateDocument}>Save</Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(EditDocumentModal);