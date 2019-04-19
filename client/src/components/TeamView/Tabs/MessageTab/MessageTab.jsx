import React, { useState } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';

/////Components/////
import Message from './Message';
import Loader from 'react-loader-spinner';

/////GraphQL/////
import { useMutation } from '../../../../graphQL/useMutation';
import {
  MESSAGES_QUERY,
  USER_QUERY,
  TEAM_QUERY,
} from '../../../../graphQL/Queries';
import { CREATE_MESSAGE } from '../../../../graphQL/Mutations';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  textField: {
    marginTop: '10px',
    width: '60%',
  },
  button: {
    margin: '0',
  },
  userPic: {
    height: '55px',
    width: '55px',
    borderRadius: '50px',
    margin: '10px',
  },
});

const MessageTab = props => {
  const userId = localStorage.getItem('userId');
  const user = useQuery(USER_QUERY, {
    variables: {
      id: userId,
    },
  });
  const team = useQuery(TEAM_QUERY, {
    variables: {
      id: props.teamId,
    },
  });
  const messages = useQuery(MESSAGES_QUERY, {
    variables: { teamId: props.teamId },
  });

  const trigger = () => {
    messages.refetch()
  };

  const [messageContent, setMessageContent] = useState('');

  const handleChange = e => {
    setMessageContent(e.target.value);
  };

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    update: (cache, { data }) => {
      const { messages } = cache.readQuery({
        query: MESSAGES_QUERY,
        variables: { teamId: props.teamId },
      });
      cache.writeQuery({
        query: MESSAGES_QUERY,
        variables: { teamId: props.teamId },
        data: { messages: [...messages, data.createMessage] },
      });
    },
    variables: {
      title: messageContent,
      content: messageContent,
      userId: userId,
      teamId: props.teamId,
    },
    onCompleted: e => {
      props.setMsg('created a message');
      setMessageContent('');
    },
    onError: err => console.log(err),
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

  const { classes } = props;
  return (
    <div style={{textAlign: 'left', minWidth: '430px'}}>
      <div>
        {user.data && user.data.user ? (
          <img
            className={classes.userPic}
            src={user.data.user.profilePic}
            alt="profile picture"
          />
        ) : (
          <AccountCircle />
        )}
        <TextField
          required
          label={`Message ${
            team.data && team.data.team
              ? `${team.data.team.teamName}...`
              : 'your team...'
          }`}
          value={messageContent}
          onChange={handleChange}
          name="create message"
          className={classes.textField}
          onKeyPress={e => {
            if (messageContent && e.key === 'Enter') {
              createMessage();
            }
          }}
        />
      </div>
      <div>
        {messages.loading && (
          <Loader type="ThreeDots" height="25px" width="25px" color="#0984e3" />
        )}
        {messages.error && (
          <Typography component="h3">Error fetching messages.</Typography>
        )}
        {messages.data &&
          messages.data.messages &&
          messages.data.messages
            .sort(compare)
            .map(message => (
              <Message
                trigger={trigger}
                compare={compare}
                setMsg={props.setMsg}
                teamId={props.teamId}
                user={user}
                message={message}
                key={message.id}
              />
            ))}
      </div>
    </div>
  );
};

export default withStyles(styles)(MessageTab);
