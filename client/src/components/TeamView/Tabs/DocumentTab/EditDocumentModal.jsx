import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import { useMutation } from "../../../../graphQL/useMutation";
import { useQuery } from "react-apollo-hooks";
import gql from 'graphql-tag';

import {DOCUMENT_QUERY} from '../../../../graphQL/Queries';
import {UPDATE_DOCUMENT} from '../../../../graphQL/Mutations';

const styles = theme => ({
  paper: {
    "max-width": "800px",
    margin: "0 auto",
    "text-align": "left",
    padding: "20px"
  },
  messageInput: {
    width: "100%",
    marginBottom: "10px"
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
        <h3>Edit Document</h3>
        <Close onClick={closeModal} />
        <br />
        <input 
        type="text"
        value={messageInfo.doc_url}
        onChange={handleChange}
        name="doc_url"
        placeholder="Document URL"
        className={classes.messageInfo}
        />
        <br />
        <input
          type="text"
          value={messageInfo.title}
          onChange={handleChange}
          name="title"
          placeholder="Message Title"
          className={classes.messageInput}
        />
        <br />
        <textarea
          name="textContent"
          onChange={handleChange}
          cols="30"
          rows="10"
          value={messageInfo.textContent}
          placeholder="Message Content"
          className={classes.messageInput}
        />
        <br />
        <Button onClick={updateDocument}>Save</Button>
      </Paper>
    </Modal>
  </div>
);
};

export default withStyles(styles)(EditDocumentModal);