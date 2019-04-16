import React, {useState, useEffect} from "react";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import Button from "@material-ui/core/Button";
import AccountCircle from "@material-ui/icons/AccountCircle";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import TextField from "@material-ui/core/TextField";

import MessageComment from "./MessageComment";
import MoreMenu from "./MoreMenu";

import { useMutation } from "../../../../graphQL/useMutation";
import { LIKE_MESSAGE, UNLIKE_MESSAGE, ADD_MESSAGE_COMMENT, UPDATE_MESSAGE } from "../../../../graphQL/Mutations";
import { MESSAGES_QUERY } from "../../../../graphQL/Queries";

const styles = theme => ({
  root: {
    display: 'flex',
    marginTop: "35px",
  },
  userPic: {
    height: '55px',
    width: '55px',
    borderRadius: '50%',
    margin: '10px'
  },
  userPicSmall: {
    height: '35px',
    width: '35px',
    borderRadius: '50%',
    margin: '10px'
  },
  content: {
    marginTop: '7px',
    fontSize: '21px' 
  },
  contentTitle: {
    fontSize: '17px',
    display: 'flex', 
    marginBottom: '6px'
  },
  name: {
    fontWeight: 'bold',
    marginRight: '10px'
  },
  time: {
    color: 'grey'
  },
  messageReaction: {
    display: 'flex',
    alignItems: 'center',
    margin: '6px 0',
    color: 'grey',
    fontSize: '13px'
  },
  viewReplies: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '13px'
  },
  thumbs: {
    width: '18px',
    height: 'auto',
    margin: '0 5px'
  },
  likes: {
    display: 'inline',
    fontSize: '18px'
  },
  replyToMessage: {
    width: '300px'
  },
  textField: {
    width: '80%',
    fontSize: '14px'
  },
});

const Message = props => {

  const userId = localStorage.getItem('userId');
  const [messageEditStatus, setMessageEditStatus] = useState(false);
  const [messageHandler, setMessageHandler] = useState(''); 
  const [replyStatus, setReplyStatus] = useState(false);
  const [viewReplies, setViewReplies] = useState(false);
  const [reply, setReply] = useState('');
  const [menuStatus, setMenuStatus] = useState(false);

  const [likeMessage] = useMutation(LIKE_MESSAGE, {
    variables: {
      userId: userId,
      messageId: props.message.id
    },
    onCompleted: e => {
      props.setMsg("liked a message");
    },
    onError: err => console.log(err)
  });

  const [unlikeMessage] = useMutation(UNLIKE_MESSAGE, {
    variables: {
      messageId: props.message.id,
      userId: userId
    },
    onCompleted: e => {
      props.setMsg("unliked a message");
    },
    onError: err => console.log(err)
  });

  const [updateMessage] = useMutation(UPDATE_MESSAGE, {
    variables: {
      messageId: props.message.id,
      title: messageHandler,
      content: messageHandler
    },
    onCompleted: e => {
      props.setMsg('updated a message')
      setMessageEditStatus(false)
    },
    onError: err => console.log(err)
  });

  const [addMessageComment] = useMutation(ADD_MESSAGE_COMMENT, {
    update: (cache, { data }) => {
      const {messages} = cache.readQuery({
        query: MESSAGES_QUERY,
        variables: { teamId: props.teamId }
      });
      let message = messages.find(message => message.id === props.message.id)
      let newMessages = messages.filter(message => message.id !== props.message.id)
      message.comments.push(data.addMessageComment);
      cache.writeQuery({
        query: MESSAGES_QUERY,
        variables: { teamId: props.teamId },
        data: {
          ...newMessages, message
        }
      })
    },
    variables: {
      messageId: props.message.id,
      userId: userId,
      content: reply,
      image: ''
    },
    onCompleted: e => {
      props.setMsg("replied to a message");
      setReply('');
    },
    onError: err => console.log(err)
  });

  const handleChange = e => {
    setReply(e.target.value)
  };

  useEffect(() => {
    if(props.message.content) {
      setMessageHandler(props.message.content)
    }
  }, []);

  const handleChangeMessage = e => {
    setMessageHandler(e.target.value)
  };

  const { classes } = props;
  const user = props.message.creator;
  return (
    <div 
      className={classes.root}
      onMouseOver={() => setMenuStatus(true)}
      onMouseLeave={()=> setMenuStatus(false)}
    >
      {user.profilePic ? 
        <img className={classes.userPic} src={user.profilePic} alt="profile picture"/> 
        : 
        <AccountCircle className={classes.userPic}/>} 
        <div className={classes.content}>
          <div className={classes.contentTitle}>
              <div className={classes.name}>{user.name}</div>
              <div className={classes.time}>{moment(props.message.createdAt).startOf('minute').fromNow()}</div>
              {menuStatus ? (
                <MoreMenu
                  teamId={props.teamId}
                  message={props.message}
                  setMsg={props.setMsg}           
                  setMessageEditStatus={setMessageEditStatus}
                  messageEditStatus={messageEditStatus}
                />
                // <IconButton className={classes.menu}><MoreVertIcon /></IconButton>
              )
              : null}
          </div>

          {/* Triggers when a user clicks edit in the menu */}
          {messageEditStatus ? 
            <TextField 
              value={messageHandler}
              onChange={handleChangeMessage}
              onKeyPress = { e => {
                  if(e.key === 'Enter') {
                    updateMessage()
                  }
                }
              }
            /> 
          : 
          <div>{props.message.content}</div>}

          <div className={classes.messageReaction}>
            <ThumbUp className={classes.thumbs} onClick={likeMessage} /> 
            <div className={classes.likes}>{props.message && props.message.likes ? props.message.likes.length : 0}</div>
            <ThumbDown className={classes.thumbs} onClick={unlikeMessage}/> 
            <Button onClick={()=> {setReplyStatus(!replyStatus)}}>REPLY</Button>
          </div>
          {/* reply dropdown */}
          {replyStatus ? (
            <div className={classes.replyToMessage}>
              {props.user.data && props.user.data.user ? <img className={classes.userPicSmall} src={props.user.data.user.profilePic} alt="profile picture"/> : <AccountCircle />}
              <TextField
                required
                label={`Reply to ${props.user.data && props.user.data.user ? `${props.user.data.user.name}...` : 'your team...'}`}
                value={reply}
                onChange={handleChange}
                className={classes.textField}
                name="create reply"
                onKeyPress = { e => {
                  if(reply && e.key === 'Enter') {
                    addMessageComment();
                    setReplyStatus(false);
                    setViewReplies(true);
                  }
                }
              }
              />
            </div>
          ) : null}
          <div className={classes.viewReplies} onClick={() => setViewReplies(!viewReplies)}>
            View {props.message.comments && props.message.comments.length} replies 
            {viewReplies? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </div>
          {/* view replies dropdown */}
          {viewReplies ? ( 
            props.message.comments.sort(props.compare).map(comment => (
              <MessageComment
                key={comment.createdAt}
                comment={comment}
                message={props.message}
                setMsg={props.setMsg}
                teamId={props.teamId}
              />
            )))
            : null}
    </div>
  </div>
  );
};

export default withStyles(styles)(Message);
