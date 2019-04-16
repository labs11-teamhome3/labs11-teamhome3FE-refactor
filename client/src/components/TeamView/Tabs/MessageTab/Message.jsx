import React from "react";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import Button from "@material-ui/core/Button";
import AccountCircle from "@material-ui/icons/AccountCircle";

import { useMutation } from "../../../../graphQL/useMutation";
import { LIKE_MESSAGE, UNLIKE_MESSAGE } from "../../../../graphQL/Mutations";
import { MESSAGE_QUERY } from "../../../../graphQL/Queries";

const styles = theme => ({
  root: {
    display: 'flex',
    marginTop: "35px",
  },
  userPic: {
    height: '60px',
    width: '60px',
    borderRadius: '50%',
    margin: '10px 10px 10px 3px'
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
  }
});

const Message = props => {
  const userId = localStorage.getItem('userId');
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
    },
    onError: err => console.log(err)
  });

  const { classes } = props;
  const user = props.message.creator;
  return (
    <div className={classes.root}>
      {user.profilePic ? 
        <img className={classes.userPic} src={user.profilePic} alt="profile picture"/> 
        : 
        <AccountCircle className={classes.userPic}/>} 
        <div className={classes.content}>
          <div className={classes.contentTitle}>
            <div className={classes.name}>{user.name}</div>
            <div className={classes.time}>{moment(props.message.createdAt).startOf('minute').fromNow()}</div>
          </div>
          <div>{props.message.content}</div>
          <div className={classes.messageReaction}>
            <ThumbUp className={classes.thumbs} onClick={likeMessage} /> 
            <div className={classes.likes}>{props.message && props.message.likes ? props.message.likes.length : 0}</div>
            <ThumbDown className={classes.thumbs} onClick={unlikeMessage}/> 
            <Button>REPLY</Button>
          </div>
          <div className={classes.viewReplies}>View Count replies v</div>
        </div>
    </div>
  );
};

export default withStyles(styles)(Message);
