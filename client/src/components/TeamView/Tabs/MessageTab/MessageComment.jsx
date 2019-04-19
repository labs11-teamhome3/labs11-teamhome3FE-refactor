import React from 'react'
import moment from "moment";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import { useMutation } from "../../../../graphQL/useMutation";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import AccountCircle from "@material-ui/icons/AccountCircle";


import {MESSAGES_QUERY} from '../../../../graphQL/Queries';
import {LIKE_MESSAGE_COMMENT, UNLIKE_MESSAGE_COMMENT} from '../../../../graphQL/Mutations';

const styles = theme => ({
  root: {
    display: 'flex',
    marginTop: "10px",
  },
  userPicSmall: {
    height: '40px',
    width: '40px',
    borderRadius: '50%',
    margin: '10px 10px 10px 0'
  },
  content: {
    marginTop: '7px',
    fontSize: '19px',
  },
  contentTitle: {
    fontSize: '15px',
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
    margin: '10px 0',
    color: 'grey',
    fontSize: '13px'
  },
  messageReactionWrap: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  delete: {
    margin: '10px 0'
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
  }
});

const DELETE_COMMENT = gql`
  mutation DELETE_COMMENT($commentId: ID!){
    deleteMessageComment(commentId: $commentId) {
      id
    }
  }
`

const MessageComment = props => {
  const userId = localStorage.getItem('userId');

  const [deleteMessageComment] = useMutation(DELETE_COMMENT, {
    update: (cache, { data }) => {
      const {messages} = cache.readQuery({
        query: MESSAGES_QUERY,
        variables: { teamId: props.teamId }
      });
      let oldMessage = messages.find(message => message.id === props.message.id)
      let newMessageComments = oldMessage.comments.filter(comment => comment.id !== props.comment.id)
      oldMessage.comments = newMessageComments;
      let newMessages = messages.filter(message => message.id !== props.message.id)
      cache.writeQuery({
        query: MESSAGES_QUERY,
        variables: { teamId: props.teamId },
        data: {
          messages: [...newMessages, oldMessage]
        }
      })
    },
    variables: {
      commentId: props.comment.id
    },
    onCompleted: e => {
      props.setMsg('deleted a comment')
    },
    onError: err => console.log(err)
  });

  const [likeMessageComment] = useMutation(LIKE_MESSAGE_COMMENT, {
    variables: {
      commentId: props.comment.id,
      userId: userId
    },
    onCompleted: e => {
      props.setMsg("liked a comment");
      props.trigger()
    },
    onError: err => console.log(err)
  });

  const [unlikeMessageComment] = useMutation(UNLIKE_MESSAGE_COMMENT, {
    variables: {
      commentId: props.comment.id,
      userId: userId
    },
    onCompleted: e => {
      props.setMsg("unliked a comment");
    },
    onError: err => console.log(err)
  });

  const { classes } = props; 
  return (
    <div className={classes.root}>
      {props.comment.user.profilePic ? (
      <img className={classes.userPicSmall} src={props.comment.user.profilePic} alt="profile picture"/> 
      ):( 
      <AccountCircle className={classes.userPicSmall}/>
      )}
      <div key={props.comment.user.createdAt} className={classes.content}>
        <div className={classes.contentTitle}>
          <div className={classes.name}>{props.comment.user.name}</div>
          <div className={classes.time}>{moment(props.comment.createdAt).startOf('minute').fromNow()}</div>
        </div>
        <div>{props.comment.content}</div>
        <div className={classes.messageReactionWrap}>
          <div className={classes.messageReaction}>
            <ThumbUp className={classes.thumbs} onClick={likeMessageComment} /> 
            <div className={classes.likes}>{props.comment.likes ? props.comment.likes.length : 0}</div>
            <ThumbDown className={classes.thumbs} onClick={unlikeMessageComment} /> 
          </div>
          <DeleteIcon className={classes.delete} onClick={deleteMessageComment} />
        </div>
      </div>
    </div>
  )
}

export default withStyles(styles)(MessageComment);
