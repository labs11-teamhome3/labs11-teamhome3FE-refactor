import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import { useMutation } from "../../../../graphQL/useMutation";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

/////Components/////
import Message from "./Message";
import MessageModal from "./MessageModal";

const MESSAGES_QUERY = gql`
  query MESSAGES_QUERY($teamId: ID!) {
    messages(teamId: $teamId) {
      id
      title
      creator {
        name
      }
    }
  }
`;

const MessageTab = props => {
  const [modalStatus, setModalStatus] = useState(false);
  const [editing, setEditing] = useState(false);
  const messages = useQuery(MESSAGES_QUERY, {
    variables: { teamId: props.teamId }
  });

  const toggleModal = e => {
    setModalStatus(!modalStatus);
  };

  return (
    <div>
      <h1>MessageTab</h1>
      <div>
        {messages.loading ? (
          <h3>Loading</h3>
        ) : (
          messages.data.messages.map(message => (
            <Message message={message} key={message.id} />
          ))
        )}
      </div>
      <Fab color="primary" aria-label="Add" onClick={toggleModal}>
        <AddIcon />
      </Fab>
      <MessageModal modalStatus={modalStatus} toggleModal={toggleModal} />
    </div>
  );
};

export default MessageTab;
