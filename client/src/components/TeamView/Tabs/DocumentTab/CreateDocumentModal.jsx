import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import { useMutation } from '../../../../graphQL/useMutation';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';

import { DOCUMENTS_QUERY, USERS_QUERY, EVENTS_QUERY } from '../../../../graphQL/Queries';
import { CREATE_EVENT } from '../../../../graphQL/Mutations';

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

const CREATE_DOCUMENT = gql`
  mutation CREATE_DOCUMENT(
    $doc_url: String!
    $teamId: ID!
    $userId: ID!
    $title: String!
    $textContent: String!
  ) {
    addDocument(
      doc_url: $doc_url
      teamId: $teamId
      userId: $userId
      title: $title
      textContent: $textContent
    ) {
      id
      title
      textContent
      doc_url
      user {
          id
      }
      team {
          id
      }
    }
  }
`;

const MessageModal = props => {
    const userId = localStorage.getItem('userId');
    const [messageInfo, setMessageInfo] = useState({
        title: '',
        textContent: '',
        doc_url: ''
    });

  const handleChange = e => {
    setMessageInfo({
      ...messageInfo,
      [e.target.name]: e.target.value,
    });
  };

  const users = useQuery(USERS_QUERY);

  const [createDocument] = useMutation(CREATE_DOCUMENT, {
    update: (cache, { data }) => {
      // console.log(data.createMessage)
      const {findDocumentsByTeam} = cache.readQuery({
        query: DOCUMENTS_QUERY,
        variables: { teamId: props.teamId },
      });
      cache.writeQuery({
        query: DOCUMENTS_QUERY,
        variables: { teamId: props.teamId },
        data: { findDocumentsByTeam: [...findDocumentsByTeam, data.addDocument] },
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
      props.setMsg('created a message');
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
          <h3>Create Document</h3>
          <Close onClick={_ => props.toggleModal('create')} />
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
          <Button onClick={createDocument}>Save</Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(MessageModal);