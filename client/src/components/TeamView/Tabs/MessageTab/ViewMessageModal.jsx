import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import DropArrow from "@material-ui/icons/ArrowDropDown";
import { useMutation } from "../../../../graphQL/useMutation";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";

import {
  MESSAGES_QUERY,
  USERS_QUERY,
  MESSAGE_QUERY
} from "../../../../graphQL/Queries";

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

const DELETE_MESSAGE = gql`
  mutation DELETE_MESSAGE($id: ID!) {
    deleteMessage(id: $id) {
      id
    }
  }
`;

const MessageModal = props => {
  console.log(props.teamId)
  const message = useQuery(MESSAGE_QUERY, {
    variables: { id: props.messageId }
  });

  const [deleteMessage] = useMutation(DELETE_MESSAGE, {
    update: (cache, { data }) => {
      console.log(data)
      const {messages} = cache.readQuery({
        query: MESSAGES_QUERY,
        variables: { teamId: props.teamId }
      });
      console.log(messages)
      cache.writeQuery({
        query: MESSAGES_QUERY,
        variables: { teamId: props.teamId },
        data: { messages: messages.filter(message => {
          console.log(`${message.id} - ${props.messageId}`)
          if(message.id !== props.messageId) {
            return message
          }
        })}
      });
    },
    variables: {
      id: props.messageId,
    },
    onCompleted: e => {
      props.toggleModal('view');
    },
    onError: err => console.log(err)
  });

  const closeModal = _ => {
    props.toggleModal("view");
  };

  const editMessage = _ => {
    props.toggleModal("edit", props.messageId);
    closeModal();
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
          <Close onClick={closeModal} />
          <br />
          <Button
            color="primary"
            className={classes.button}
            onClick={editMessage}
          >
            Edit
          </Button>
          <Button color="primary" className={classes.button} onClick={deleteMessage}>
            Delete
          </Button>
          <Button color="primary" className={classes.button}>
            Unsubscribe
          </Button>
          <h2>
            {message.data.message === undefined
              ? "Loading"
              : message.data.message.title}
          </h2>
          <br />
          <h4>
            {message.data.message === undefined
              ? "Loading"
              : message.data.message.content}
          </h4>
          <br />
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(MessageModal);
