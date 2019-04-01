import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

/////Components/////
import Message from "./Message";
import CreateMessageModal from "./CreateMessageModal";
import EditMessageModal from "./EditMessageModal";

/////Queries/////
// import g from '../../../'

const MessageTab = props => {
  const [createModalStatus, setCreateModalStatus] = useState(false);
  const [editModalStatus, setEditModalStatus] = useState(false);
  const messages = useQuery(MESSAGES_QUERY, {
    variables: { teamId: props.teamId }
  });

  const toggleModal = edit => {
    edit
      ? setEditModalStatus(!editModalStatus)
      : setCreateModalStatus(!createModalStatus);
  };

  return (
    <div>
      <h1>MessageTab</h1>
      <div>
        {messages.loading ? (
          <h3>Loading</h3>
        ) : (
          messages.data.messages.map(message => (
            <Message
              message={message}
              key={message.id}
              toggleModal={toggleModal}
            />
          ))
        )}
      </div>
      <Fab color="primary" aria-label="Add" onClick={_ => toggleModal(false)}>
        <AddIcon />
      </Fab>
      <CreateMessageModal
        modalStatus={createModalStatus}
        toggleModal={toggleModal}
      />
      <EditMessageModal
        modalStatus={editModalStatus}
        toggleModal={toggleModal}
      />
    </div>
  );
};

export default MessageTab;
