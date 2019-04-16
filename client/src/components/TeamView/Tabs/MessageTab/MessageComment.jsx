import React from 'react'
import moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from '@material-ui/core/Button';
import { useMutation } from "../../../../graphQL/useMutation";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import AccountCircle from "@material-ui/icons/AccountCircle";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import TextField from "@material-ui/core/TextField";

import {MESSAGE_QUERY} from '../../../../graphQL/Queries';

const styles = theme => ({
  root: {
    '&:hover': {
      backgroundColor: '#dfe6e9'
    },
    display: 'flex',
    marginTop: "35px",
  },
  userPic: {
    height: '60px',
    width: '60px',
    borderRadius: '50%',
    margin: '10px 10px 10px 3px'
  },
  userPicSmall: {
    height: '35px',
    width: '35px',
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

const LIKE_COMMENT = gql`
  mutation LIKE_COMMENT($commentId: ID!, $userId: ID!){
    likeMessageComment(commentId: $commentId, userId: $userId) {
      id
        content
        user {
          id
          name
        }
        image
        likes {
          id
          name
        }
    }
  }
`
const UNLIKE_COMMENT = gql`
  mutation LIKE_COMMENT($commentId: ID!, $userId: ID!){
    unlikeMessageComment(commentId: $commentId, userId: $userId) {
      id
        content
        user {
          id
          name
        }
        image
        likes {
          id
          name
        }
    }
  }
`

const MessageComment = props => {
  const userId = localStorage.getItem('userId');
  //console.log(props.comment.id);
  const [deleteComment] = useMutation(DELETE_COMMENT, {
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
            comments: message.comments.filter(
              comment => comment.id !== props.comment.id
            )
          }
        }
      });
    },
    variables: {
      commentId: props.comment.id
    },
    onCompleted: e => {
      props.setMsg('deleted a comment')
    },
    onError: err => console.log(err)
  });

  const [likeComment] = useMutation(LIKE_COMMENT, {
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
            comments: message.comments.map(comment => {
              if(comment.id === data.likeMessageComment.id) {
                return data.likeMessageComment
              } else {
                return comment
              }
            })
          }
        }
      });
    },
    variables: {
      commentId: props.comment.id,
      userId: userId
    },
    onCompleted: e => {
    },
    onError: err => console.log(err)
  });

  const [unlikeComment] = useMutation(UNLIKE_COMMENT, {
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
            comments: message.comments.map(comment => {
              if(comment.id !== data.unlikeMessageComment.id) {
                return data.likeMessageComment
              } else {
                return comment
              }
            })
          }
        }
      });
    },
    variables: {
      commentId: props.comment.id,
      userId: userId
    },
    onCompleted: e => {
    },
    onError: err => console.log(err)
  });

  const { classes } = props; 
  return (
    props.comment.user.profilePic ? (
      <img className={classes.userPic} src={props.comment.user.profilePic} alt="profile picture"/> 
      ):( 
      <AccountCircle className={classes.userPic}/>
      ),
      <div key={props.comment.user.createdAt} className={classes.content}>
        <div className={classes.contentTitle}>
          <div className={classes.name}>{props.comment.user.name}</div>
          <div className={classes.time}>{moment(props.comment.createdAt).startOf('minute').fromNow()}</div>
        </div>
        <div>{props.comment.content}</div>
        <div className={classes.messageReaction}>
          <ThumbUp className={classes.thumbs}  /> 
          <div className={classes.likes}>{props.comment.likes ? props.comment.likes.length : 0}</div>
          <ThumbDown className={classes.thumbs} /> 
        </div>
      </div>
  )
}

export default withStyles(styles)(MessageComment);
