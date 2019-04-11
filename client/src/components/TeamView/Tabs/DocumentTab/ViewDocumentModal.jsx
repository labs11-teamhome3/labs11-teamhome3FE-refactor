import React, { useState, useEffect, Fragment } from "react";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import DropArrow from "@material-ui/icons/ArrowDropDown";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import { useMutation } from "../../../../graphQL/useMutation";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";

import DocumentComment from "./DocumentComment";

import { CREATE_EVENT } from '../../../../graphQL/Mutations';

import {
  DOCUMENTS_QUERY,
  DOCUMENT_QUERY,
  MESSAGE_QUERY,
  EVENTS_QUERY
} from "../../../../graphQL/Queries";

const styles = theme => ({
  paper: {
    "max-width": "800px",
    margin: "0 auto",
    "text-align": "left",
    padding: "20px"
  },
  messageInput: {
    width: "100%",
    marginBottom: "10px"
  },
  commentInput: {
    width: "100%"
  }
});

const DELETE_DOCUMENT = gql`
  mutation DELETE_DOCUMENT($documentId: ID!) {
    deleteDocument(documentId: $documentId) {
      id
    }
  }
`;

const ADD_COMMENT = gql`
  mutation ADD_COMMENT(
    $documentId: ID!
    $userId: ID!
    $content: String!
  ) {
    addDocumentComment(
      documentId: $documentId
      userId: $userId
      content: $content
    ) {
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
`;

const ViewDocumentModal = props => {
  const userId = localStorage.getItem('userId')
  const [commentInput, setCommentInput] = useState("");

  const findDocument = useQuery(DOCUMENT_QUERY, {
    variables: { id: props.documentId }
  });
  
  const [deleteDocument] = useMutation(DELETE_DOCUMENT, {
    update: (cache, { data }) => {
      const { findDocumentsByTeam } = cache.readQuery({
        query: DOCUMENTS_QUERY,
        variables: { teamId: props.teamId }
      });
      cache.writeQuery({
        query: DOCUMENTS_QUERY,
        variables: { teamId: props.teamId },
        data: {
          findDocumentsByTeam: findDocumentsByTeam.filter(document => {
            // console.log(`${message.id} - ${props.messageId}`);
            if (document.id !== props.documentId) {
              return document;
            }
          })
        }
      });
    },
    variables: {
      documentId: props.documentId
    },
    onCompleted: e => {
      props.setMsg('deleted a document')
      props.toggleModal("view");
    },
    onError: err => console.log(err)
  });

  const [addDocumentComment] = useMutation(ADD_COMMENT, {
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
            comments: [...findDocument.comments, data.addDocumentComment]
          }
        }
      });
    },
    variables: {
      documentId: props.documentId,
      userId: userId,
      content: commentInput
    },
    onCompleted: e => {
      props.setMsg('commented on a document')
      setCommentInput("");
    },
    onError: err => console.log(err)
  });

  const closeModal = _ => {
    props.toggleModal("view");
  };

  const editMessage = _ => {
    props.toggleModal("edit", props.documentId);
    closeModal();
  };

  const addComment = e => {
    e.preventDefault();
    if(commentInput) {
      addDocumentComment();
    }
  };

  const { classes } = props;
  const document = findDocument.data.findDocument;
  //console.log('document', document)
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.modalStatus}
      >
        <Paper className={classes.paper}>
          <Close onClick={closeModal} />
          <br />
          <Button
            color="primary"
            className={classes.button}
            onClick={editMessage}
          >
            Edit
          </Button>
          <Button
            color="primary"
            className={classes.button}
            onClick={deleteDocument}
          >
            Delete
          </Button>
          <h2>
            {document === undefined
              ? "Loading"
              : document.title}
          </h2>
          <br />
          <h4>
            {document === undefined
              ? "Loading"
              : document.textContent}
          </h4>
          <br />
          {document !== undefined &&
          document.comments.length !== undefined ? (
            <div>
              <h3>Comments</h3>
              <List>
                {document.comments.map((comment, index) => (
                  <Fragment key={comment.id}>
                    <DocumentComment
                      comment={comment}
                      documentId={props.documentId}
                      setMsg={props.setMsg}
                    />
                    {index ===
                    document.comments.length - 1 ? null : (
                      <Divider />
                    )}
                  </Fragment>
                ))}
              </List>
            </div> 
          ) : null}
          <form onSubmit={addComment}>
            <input
              type="text"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              className={classes.commentInput}
            />
          </form>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(ViewDocumentModal);