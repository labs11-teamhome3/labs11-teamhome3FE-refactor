import React from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Typography } from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import { useMutation } from "../../../../graphQL/useMutation";
import gql from "graphql-tag";

import {MESSAGE_QUERY} from '../../../../graphQL/Queries';

const DELETE_COMMENT = gql`
  mutation DELETE_COMMENT($commentId: ID!){
    deleteMessageComment(commentId: $commentId) {
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

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    // update: (cache, { data }) => {
    //   console.log(data);
    //   const { message } = cache.readQuery({
    //     query: MESSAGE_QUERY,
    //     variables: { id: props.messageId }
    //   });
    //   console.log(message);
    //   cache.writeQuery({
    //     query: MESSAGE_QUERY,
    //     variables: { id: props.messageId },
    //     data: {
    //       message: message.comments.filter(comment => {
    //         if (comment.id !== props.comment.id) {
    //           return comment;
    //         }
    //       })
    //     }
    //   });
    // },
    variables: {
      commentId: props.comment.id
    },
    onCompleted: e => {
    },
    onError: err => console.log(err)
  });

  return (
        <ListItem>
          <ListItemText primary={<strong>{props.comment.user.name} <DeleteIcon onClick={deleteComment} /></strong>} secondary={
            <Typography>{props.comment.content}</Typography>
          } />
          <h1>{props.key}</h1>
        </ListItem>
  )
}

export default MessageComment
