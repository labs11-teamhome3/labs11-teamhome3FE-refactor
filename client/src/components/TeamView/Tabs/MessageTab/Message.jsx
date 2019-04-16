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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';

import MessageComment from "./MessageComment";
import MoreMenu from "./MoreMenu";

import { useMutation } from "../../../../graphQL/useMutation";
import { LIKE_MESSAGE, UNLIKE_MESSAGE, ADD_MESSAGE_COMMENT } from "../../../../graphQL/Mutations";
import { MESSAGE_QUERY } from "../../../../graphQL/Queries";
import { Icon } from "../../../../../node_modules/@material-ui/core";

const styles = theme => ({
  root: {
    '&:hover': {
      backgroundColor: '#FFFFFF',
    },
    display: 'flex',
    marginTop: "35px",
  },
  userPic: {
    height: '60px',
    width: '60px',
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
    width: '600px'
  },
  textField: {
    width: '80%'
  },
});

const Message = props => {
  const userId = localStorage.getItem('userId');
  const [replyStatus, setReplyStatus] = useState(false);
  const [viewReplies, setViewReplies] = useState(false);
  const [reply, setReply] = useState('');
  const [menuStatus, setMenuStatus] = useState(false);

  const [likeMessage] = useMutation(LIKE_MESSAGE, {
    update: (cache, { data }) => {
      console.log('#### messageId', props)
      const { message } = cache.readQuery({
        query: MESSAGE_QUERY,
        variables: { id: props.message.id }
      });
      cache.writeQuery({
        query: MESSAGE_QUERY,
        variables: { id: props.message.id },
        data: {
          message: {
            ...message,
            likes: message.likes.map(like => {
              if(like.id === data.likeMessage.id) {
                return data.likeMessage
              } else {
                return like
              }
            })
          }
        }
      });
    },
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
    update: (cache, { data }) => {
      const { message } = cache.readQuery({
        query: MESSAGE_QUERY,
        variables: { id: props.messageId }
      });
      cache.writeQuery({
        query: MESSAGE_QUERY,
        variables: { id: props.messageId },
        data: {
          message: {
            ...message,
            likes: message.likes.map(like => {
              if(like.id !== data.unlikeMessage.id) {
                return data.unlikeMessage
              } else {
                return like
              }
            })
          }
        }
      });
    },
    variables: {
      messageId: props.message.id,
      userId: userId
    },
    onCompleted: e => {
      props.setMsg("unliked a message");
    },
    onError: err => console.log(err)
  });

  const [addMessageComment] = useMutation(ADD_MESSAGE_COMMENT, {
    update: (cache, { data }) => {
      const { message } = cache.readQuery({
        query: MESSAGE_QUERY,
        variables: { id: props.messageId }
      });
      cache.writeQuery({
        query: MESSAGE_QUERY,
        variables: { id: props.messageId },
        data: {
          message: {
            ...message,
            comments: [...message.comments, data.addMessageComment]
          }
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
    },
    onError: err => console.log(err)
  });

  const handleChange = e => {
    setReply(e.target.value)
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
                />
                // <IconButton className={classes.menu}><MoreVertIcon /></IconButton>
              )
              : null}
          </div>
          <div>{props.message.content}</div>
          <div className={classes.messageReaction}>
            <ThumbUp className={classes.thumbs} onClick={likeMessage} /> 
            <div className={classes.likes}>{props.message && props.message.likes ? props.message.likes.length : 0}</div>
            <ThumbDown className={classes.thumbs} onClick={unlikeMessage}/> 
            <Button onClick={()=> {setReplyStatus(true)}}>REPLY</Button>
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
            props.message.comments.map(comment => (
              <MessageComment
                key={comment.createdAt}
                comment={comment}

              />
            )))
            : null}
    </div>
  </div>
  );
};

export default withStyles(styles)(Message);
