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

const MessageComment = props => {
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
      props.setMsg('deleted a comment')
    },
    onError: err => console.log(err)
  });

  return (
        <ListItem>
          <ListItemText primary={<strong>{props.comment.user.name} <DeleteIcon onClick={deleteComment} /></strong>} secondary={
            <Typography>{props.comment.content} - {props.comment.likes.length} Likes</Typography>
          } />
                <Button variant="contained" color="secondary">
        Delete
        <DeleteIcon/>
      </Button>
        </ListItem>
  )
}

export default MessageComment
