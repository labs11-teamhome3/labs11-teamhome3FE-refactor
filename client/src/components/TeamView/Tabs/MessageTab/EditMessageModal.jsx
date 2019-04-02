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
import gql from 'graphql-tag';

import {MESSAGES_QUERY, USERS_QUERY, MESSAGE_QUERY} from '../../../../graphQL/Queries';

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

const UPDATE_MESSAGE = gql`
  mutation UPDATE_MESSAGE($id: ID!, $title: String, $content: String){
  updateMessage(
    id: $id
    title: $title
    content: $content
  ) {
  	id
    title
    creator {
      id
      name
    }
  }
}
`

const MessageModal = props => {
  const [messageInfo, setMessageInfo] = useState({
    title: "",
    content: ""
  });

  const [updateMessage] = useMutation(UPDATE_MESSAGE, {
    // update: (cache, { data }) => {
    //   console.log(data)
    //   const {messages} = cache.readQuery({
    //     query: MESSAGES_QUERY,
    //     variables: { teamId: props.teamId }
    //   });
    //   cache.writeQuery({
    //     query: MESSAGES_QUERY,
    //     variables: { teamId: props.teamId },
    //     data: { messages: messages.map(message => {
    //       if(message.id === props.messageId) {
    //         return data.updateMessage;
    //       } else {
    //         return message;
    //       }
    //     } ) }
    //   });
    // },
    variables: {
      id: props.messageId,
      title: messageInfo.title,
      content: messageInfo.content,
    },
    onCompleted: e => {
      props.toggleModal('edit');
      setMessageInfo({
        title: '',
        content: ''
      })
    },
    onError: err => console.log(err)
  });

  const message = useQuery(MESSAGE_QUERY, {
    variables: {id: props.messageId}
  })

  useEffect(_ => {
    if(message.data.message !== undefined) {
      setMessageInfo({
        title: message.data.message.title,
        content: message.data.message.content
      })
    }
  }, [message.data])

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
      content: ''
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
          <h3>Edit Message</h3>
          <Close onClick={closeModal} />
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
          <Button onClick={updateMessage}>Save</Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(MessageModal);
