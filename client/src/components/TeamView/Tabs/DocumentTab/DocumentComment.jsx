import React from 'react'
import moment from "moment";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Typography } from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useMutation } from "../../../../graphQL/useMutation";
import AccountCircle from "@material-ui/icons/AccountCircle";

import {DOCUMENT_QUERY} from '../../../../graphQL/Queries';
import {DELETE_COMMENT, LIKE_COMMENT, UNLIKE_COMMENT} from '../../../../graphQL/Mutations';

const styles = theme => ({
  commentTitle: {
    display: 'flex',
    justifyContent: 'space-between'
  },
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
    fontSize: '21px',
    
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

const DocumentComment = props => {
  const userId = localStorage.getItem('userId');
  const [deleteComment] = useMutation(DELETE_COMMENT, {
    update: (cache, { data }) => {
      const { findDocument } = cache.readQuery({
        query: DOCUMENT_QUERY,
        variables: { id: props.documentId }
      });
      cache.writeQuery({
        query: DOCUMENT_QUERY,
        variables: { id: props.documentId },
        data: {
          findDocument: {
            ...findDocument,
            comments: findDocument.comments.filter(comment => {
              if (comment.id !== props.comment.id) {
                return comment;
              } return null
            })
          }
        }
      });
    },
    variables: {
      documentCommentId: props.comment.id
    },
    onCompleted: e => {
      props.setMsg('deleted a comment')
    },
    onError: err => console.log(err)
  });

  const [likeComment] = useMutation(LIKE_COMMENT, {
    update: (cache, { data }) => {
      const { findDocument } = cache.readQuery({
        query: DOCUMENT_QUERY,
        variables: { id: props.documentId }
      });
      cache.writeQuery({
        query: DOCUMENT_QUERY,
        variables: { id: props.documentId },
        data: {
          findDocument: {
            ...findDocument,
            comments: findDocument.comments.map(comment => {
              if(comment.id === data.likeDocumentComment.id) {
                return data.likeDocumentComment
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
      const { findDocument } = cache.readQuery({
        query: DOCUMENT_QUERY,
        variables: { id: props.documentId }
      });
      cache.writeQuery({
        query: DOCUMENT_QUERY,
        variables: { id: props.documentId },
        data: {
          findDocument: {
            ...findDocument,
            comments: findDocument.comments.map(comment => {
              if(comment.id !== data.unlikeDocumentComment.id) {
                return data.likeDocumentComment
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
  console.log('prog', props)
  return (
    <ListItem className={classes.root}>
      {props.comment.user.profilePic ? (
      <img className={classes.userPicSmall} src={props.comment.user.profilePic} alt="profile picture"/> 
      ):( 
      <AccountCircle className={classes.userPicSmall}/>
      )}
      <div className={classes.content}>
        <div className={classes.contentTitle}>
          <div className={classes.name}>{props.comment.user.name}</div>
          <div className={classes.time}>{moment(props.comment.createdAt).startOf('minute').fromNow()}</div>
        </div>
        <div>{props.comment.content}</div>
        <div className={classes.messageReactionWrap}>
          <div className={classes.messageReaction}>
            <ThumbUp className={classes.thumbs} onClick={likeComment} /> 
            <div className={classes.likes}>{props.comment.likes ? props.comment.likes.length : 0}</div>
            <ThumbDown className={classes.thumbs} onClick={unlikeComment} /> 
          </div>
          <DeleteIcon className={classes.delete} onClick={deleteComment} />
        </div>
      </div>
    </ListItem>
  )
}

export default withStyles(styles)(DocumentComment);