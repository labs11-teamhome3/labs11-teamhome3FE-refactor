import React from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Typography } from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import Button from '@material-ui/core/Button';
import { useMutation } from "../../../../graphQL/useMutation";
import gql from "graphql-tag";

import {MESSAGE_QUERY} from '../../../../graphQL/Queries';

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
  console.log(props.comment.id);
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
            comments: message.comments.filter(comment => {
              if (comment.id !== props.comment.id) {
                return comment;
              }
            })
          }
        }
      });
    },
    variables: {
      commentId: props.comment.id
    },
    onCompleted: e => {
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

  console.log(props.comment)

  return (
        <ListItem>
          <ListItemText primary={<strong>{props.comment.user.name} <DeleteIcon onClick={deleteComment} /></strong>} secondary={
            <Typography>{props.comment.content} - {props.comment.likes.length} Likes</Typography>
          } />
          {props.comment.likes.find(like => like.id === userId) ? <Button variant="contained" color="primary" onClick={unlikeComment}>Unlike</Button> : <Button variant="contained" color="primary" onClick={likeComment}>Like</Button>}
        </ListItem>
  )
}

export default MessageComment
