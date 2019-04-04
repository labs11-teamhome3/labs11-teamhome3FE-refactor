import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useMutation } from "../../../../graphQL/useMutation";

/////Components/////
import Message from "./Message";
import CreateMessageModal from "./CreateMessageModal";
import ViewMessageModal from "./ViewMessageModal";
import EditMessageModal from "./EditMessageModal";

/////Queries/////
import { CREATE_EVENT } from '../../../../graphQL/Mutations';
import {
  MESSAGES_QUERY,
  USERS_QUERY,
  MESSAGE_QUERY,
  EVENTS_QUERY
} from "../../../../graphQL/Queries";

const MessageTab = props => {
  const userId = localStorage.getItem('userId')
  const [msg, setMsg] = useState(null);

  useEffect( _ => {
    createEvent();
  }, [msg])

  const [createEvent] = useMutation(CREATE_EVENT, {
    update: (cache, { data }) => {
      // console.log(data.createMessage)
      const {findEventsByTeam} = cache.readQuery({
        query: EVENTS_QUERY,
        variables: { teamId: props.teamId },
      });
      cache.writeQuery({
        query: EVENTS_QUERY,
        variables: { teamId: props.teamId },
        data: { findEventsByTeam: [...findEventsByTeam, data.addEvent] },
      });
    },
    variables: {
      action_string: msg,
      object_string: '',
      userId: userId,
      teamId: props.teamId,
    },
    onCompleted: e => {
    },
    onError: err => console.log(err),
  });

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
        // console.log(messageId);
        setEditModalStatus({
          status: !editModalStatus.status,
          messageId
        });
        break;
    }
  };
  // console.log('################', messages)
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
        setMsg={setMsg}
      />
      {editModalStatus ? (
        <EditMessageModal
          modalStatus={editModalStatus.status}
          messageId={editModalStatus.messageId}
          toggleModal={toggleModal}
          setMsg={setMsg}
        />
      ) : null}
      {viewModalStatus ? (
        <ViewMessageModal
          setMsg={setMsg}
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