import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import { withStyles } from '@material-ui/core/styles';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import AccountCircle from "@material-ui/icons/AccountCircle";

/////Components/////
import Message from "./Message";
import CreateMessageModal from "./CreateMessageModal";
import ViewMessageModal from "./ViewMessageModal";
import EditMessageModal from "./EditMessageModal";

/////GraphQL/////
import { useMutation } from "../../../../graphQL/useMutation";
import { MESSAGES_QUERY, MESSAGE_QUERY, USER_QUERY, TEAM_QUERY } from "../../../../graphQL/Queries";
import { CREATE_MESSAGE, LIKE_MESSAGE, UNLIKE_MESSAGE } from "../../../../graphQL/Mutations";

const styles = theme => ({
  paper: {
    position: 'relative',
    top: '24%',
    'max-width': '600px',
    margin: '0 auto',
    'text-align': 'left',
    padding: '30px',
  },
  textField: {
    width: '60%'
  },
  button: {
    margin: '0'
  },
  userPic: {
    height: '55px',
    width: '55px',
    borderRadius: '50px',
    margin: '4px 12px 0 0'
  }
});

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
  const messages = useQuery(MESSAGES_QUERY, {
    variables: { teamId: props.teamId }
  });

  const [messageContent, setMessageContent] = useState('');
  const [createModalStatus, setCreateModalStatus] = useState(false);
  const [editModalStatus, setEditModalStatus] = useState({
    status: false,
    messageId: null
  });
  const [viewModalStatus, setViewModalStatus] = useState({
    status: false,
    messageId: null
  });
  
  const handleChange = e => {
    setMessageContent(e.target.value)
  };

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    update: (cache, { data }) => {
      const { messages } = cache.readQuery({
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
      title: messageContent,
      content: messageContent,
      userId: userId,
      teamId: props.teamId
    },
    onCompleted: e => {
      props.setMsg("created a message");
      setMessageContent('')
    },
    onError: err => console.log(err)
  });


  function compare(a, b) {
    const createdAtA = a.createdAt.toUpperCase();
    const createdAtB = b.createdAt.toUpperCase();
    
    let comparison = 0;
    if (createdAtA > createdAtB) {
      comparison = 1;
    } else if (createdAtA < createdAtB) {
      comparison = -1;
    }
    return comparison * -1;
  }

  // const toggleModal = (modal, messageId = null) => {
  //   switch (modal) {
  //     case "view":
  //       setViewModalStatus({
  //         status: !viewModalStatus.status,
  //         messageId
  //       });
  //       break;

  //     case "create":
  //       setCreateModalStatus(!createModalStatus);
  //       break;

  //     case "edit":
  //       // console.log(messageId);
  //       setEditModalStatus({
  //         status: !editModalStatus.status,
  //         messageId
  //       });
  //       break;
      
  //     default:
  //       break;
  //   }
  // };
  
  const { classes } = props;
  //console.log('### messages', messages) 
  return (
    <div style={{textAlign: 'left'}}>
      <div>
        {user.data && user.data.user ? <img className={classes.userPic} src={user.data.user.profilePic} alt="profile picture"/> : <AccountCircle />}
        <TextField
          required
          label={`Message ${team.data && team.data.team ? `${team.data.team.teamName}...` : 'your team...'}`}
          value={messageContent}
          onChange={handleChange}
          name="create message"
          className={classes.textField}
          onKeyPress = { e => {
            if(messageContent && e.key === 'Enter') {
              createMessage()
            }
          }
        }
        />
      </div>
      <div>
        {messages.loading ? (
          <h3>Loading</h3>
        ) : (
          messages.data.messages.sort(compare).map(message => (
            <Message
              setMsg={props.setMsg}
              user={user}
              message={message}
              key={message.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default withStyles(styles)(MessageTab);
