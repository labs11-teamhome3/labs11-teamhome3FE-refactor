import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";

/////Components/////
import Message from "./Message";
import CreateMessageModal from "./CreateMessageModal";
import ViewMessageModal from "./ViewMessageModal";
import EditMessageModal from "./EditMessageModal";

/////Queries/////
import { MESSAGES_QUERY, USER_QUERY, TEAM_QUERY } from "../../../../graphQL/Queries";

const MessageTab = props => {
  const userId = localStorage.getItem('userId')
  const user = useQuery(USER_QUERY, {
    variables: {
      id: userId
    }
  })
  const team = useQuery(TEAM_QUERY, {
    variables: {
      id: props.teamId
    }
  })

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
      
      default:
        break;
    }
  };
  console.log('################ team', team.data)
  return (
    <div>
      <div>
        <TextField
          required
          label={`Message ${team.data && team.data.team ? team.data.team.teamName : 'your team'}`}
          // value={messageInfo.title}
          // onChange={handleChange}
          // name="title"
          // className={classes.textField}
        />
      </div>
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
        setMsg={props.setMsg}
      />
      {editModalStatus ? (
        <EditMessageModal
          modalStatus={editModalStatus.status}
          messageId={editModalStatus.messageId}
          toggleModal={toggleModal}
          setMsg={props.setMsg}
        />
      ) : null}
      {viewModalStatus ? (
        <ViewMessageModal
          modalStatus={viewModalStatus.status}
          messageId={viewModalStatus.messageId}
          toggleModal={toggleModal}
          teamId={props.teamId}
          setMsg={props.setMsg}
        />
      ) : null}
    </div>
  );
};

export default MessageTab;
