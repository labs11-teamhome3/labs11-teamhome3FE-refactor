import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

/////Components/////
import Message from "./Message";
import CreateMessageModal from "./CreateMessageModal";
import ViewMessageModal from "./ViewMessageModal";
import EditMessageModal from "./EditMessageModal";

/////Queries/////
import { MESSAGES_QUERY } from "../../../../graphQL/Queries";

const MessageTab = props => {
  const [createModalStatus, setCreateModalStatus] = useState(false);
  const [editModalStatus, setEditModalStatus] = useState({
    status: false,
    messageId: null
  });
  const [viewModalStatus, setViewModalStatus] = useState({
    status: false,
    messageId: null
  });
  const messages = useQuery(MESSAGES_QUERY, {
    variables: { teamId: props.teamId }
  });

  const toggleModal = (modal, messageId = null) => {
    switch (modal) {
      case "view":
        setViewModalStatus({
          status: !viewModalStatus.status,
          messageId
        });
        break;

      case "create":
        setCreateModalStatus(!createModalStatus);
        break;

      case "edit":
        setEditModalStatus({
          status: !editModalStatus.status,
          messageId
        });
        break;
    }
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
      <Fab
        color="primary"
        aria-label="Add"
        onClick={_ => toggleModal("create")}
      >
        <AddIcon />
      </Fab>
      <CreateMessageModal
        modalStatus={createModalStatus}
        toggleModal={toggleModal}
        teamId={props.teamId}
      />
      {editModalStatus ? (
        <EditMessageModal
          modalStatus={editModalStatus.status}
          messageId={editModalStatus.messageId}
          toggleModal={toggleModal}
        />
      ) : null}
      {viewModalStatus ? (
        <ViewMessageModal
          modalStatus={viewModalStatus.status}
          messageId={viewModalStatus.messageId}
          toggleModal={toggleModal}
          teamId={props.teamId}
        />
      ) : null}
    </div>
  );
};

export default MessageTab;
