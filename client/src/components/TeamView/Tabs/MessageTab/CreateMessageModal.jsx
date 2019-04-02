import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import { useMutation } from "../../../../graphQL/useMutation";
import { useQuery } from "react-apollo-hooks";
import gql from 'graphql-tag';

import {MESSAGES_QUERY, USERS_QUERY} from '../../../../graphQL/Queries';

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

const CREATE_MESSAGE = gql`
  mutation CREATE_MESSAGE($title: String!, $teamId: ID!, $userId: ID!, $content: String!) {
    createMessage (title: $title, teamId: $teamId, userId: $userId, content: $content) {
      id
      title
      creator {
        id
        name
      }
    }
  }
`;

const MessageModal = props => {
  const [messageInfo, setMessageInfo] = useState({
    title: "",
    content: ""
  });

  const handleChange = e => {
    setMessageInfo({
      ...messageInfo,
      [e.target.name]: e.target.value
    });
  };

  const users = useQuery(USERS_QUERY);
  const [createMessage] = useMutation(CREATE_MESSAGE, {
    update: (cache, { data }) => {
      console.log(data.createMessage)
      const {messages} = cache.readQuery({
        query: MESSAGES_QUERY,
        variables: { teamId: props.teamId }
      });
      cache.writeQuery({
        query: MESSAGES_QUERY,
        variables: { teamId: props.teamId },
        data: { messages: [...messages, data.createMessage] }
      });
    },
    variables: {
      title: messageInfo.title,
      content: messageInfo.content,
      userId: users.loading ? "" : users.data.users[0].id,
      teamId: props.teamId
    },
    onCompleted: e => {
      props.toggleModal('create');
      setMessageInfo({
        title: '',
        content: ''
      })
    },
    onError: err => console.log(err)
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
          <h3>Create Message</h3>
          <Close onClick={_ => props.toggleModal("create")} />
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
            name="content"
            onChange={handleChange}
            cols="30"
            rows="10"
            value={messageInfo.content}
            placeholder="Message Content"
            className={classes.messageInput}
          />
          <br />
          <Button onClick={createMessage}>Save</Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(MessageModal);
