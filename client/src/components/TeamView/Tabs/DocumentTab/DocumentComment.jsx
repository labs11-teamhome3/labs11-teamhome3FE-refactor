import React from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Typography } from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useMutation } from "../../../../graphQL/useMutation";

import {DOCUMENT_QUERY} from '../../../../graphQL/Queries';
import {DELETE_COMMENT, LIKE_COMMENT, UNLIKE_COMMENT} from '../../../../graphQL/Mutations';

const styles = theme => ({
  commentTitle: {
    display: 'flex',
    justifyContent: 'space-between'
  },
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
  return (
    <ListItem>
      <ListItemText 
        primary=
        {<div className={classes.commentTitle}>
          {props.comment.user.name}
          <div>
            <DeleteIcon onClick={deleteComment} />
            {props.comment.likes.find(like => like.id === userId) ? <ThumbDown variant="contained" color="primary" onClick={unlikeComment}>Unlike</ThumbDown> : <ThumbUp variant="contained" color="primary" onClick={likeComment}>Like</ThumbUp>}
          </div> 
        </div>}
      secondary={
          <>
          <Typography>{props.comment.content}</Typography>
          <Typography>{props.comment.likes.length} Likes</Typography>
          </>
        } />
    </ListItem>
  )
}

export default withStyles(styles)(DocumentComment);