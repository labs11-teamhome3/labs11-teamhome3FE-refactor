import React, { useState, Fragment } from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import File from '@material-ui/icons/InsertDriveFileOutlined';
import { useMutation } from '../../../../graphQL/useMutation';
import { useQuery } from 'react-apollo-hooks';
import Loader from 'react-loader-spinner';

import DocumentComment from './DocumentComment';

import { DELETE_DOCUMENT, ADD_COMMENT } from '../../../../graphQL/Mutations';

import { DOCUMENTS_QUERY, DOCUMENT_QUERY } from '../../../../graphQL/Queries';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  paper: {
    position: 'relative',
    top: '24%',
    'max-width': '600px',
    margin: '0 auto',
    'text-align': 'left',
    padding: '30px',
  },
  textField: {
    width: '70%',
  },
  viewDocument: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '25px',
  },
  button: {
    margin: '10px 0 0',
  },
  commentInput: {
    width: '100%',
  },
});

const ViewDocumentModal = props => {
  const userId = localStorage.getItem('userId');
  const [commentInput, setCommentInput] = useState('');

  const findDocument = useQuery(DOCUMENT_QUERY, {
    variables: { id: props.documentId },
  });

  const [addDocumentComment] = useMutation(ADD_COMMENT, {
    update: (cache, { data }) => {
      const { findDocument } = cache.readQuery({
        query: DOCUMENT_QUERY,
        variables: { id: props.documentId },
      });
      cache.writeQuery({
        query: DOCUMENT_QUERY,
        variables: { id: props.documentId },
        data: {
          findDocument: {
            ...findDocument,
            comments: [...findDocument.comments, data.addDocumentComment],
          },
        },
      });
    },
    variables: {
      documentId: props.documentId,
      userId: userId,
      content: commentInput,
    },
    onCompleted: e => {
      props.setMsg('commented on a document');
      setCommentInput('');
    },
    onError: err => console.log(err),
  });

  const closeModal = _ => {
    props.toggleModal('view');
  };

  const addComment = e => {
    e.preventDefault();
    if (commentInput) {
      addDocumentComment();
    }
  };

  const { classes } = props;
  const document = findDocument.data.findDocument;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.modalStatus}
      >
        <Paper className={classes.paper}>
          <div className={classes.viewDocument}>
            <div>
              <File />
              <div>
                {document === undefined ? (
                  <Loader
                    type="ThreeDots"
                    height="25px"
                    width="25px"
                    color="#0984e3"
                  />
                ) : (
                  document.title
                )}
              </div>
            </div>
            <Close onClick={closeModal} />
          </div>
          <div style={{ margin: '10px 0' }}>
            {document === undefined ? (
              <Loader
                type="ThreeDots"
                height="25px"
                width="25px"
                color="#0984e3"
              />
            ) : (
              document.textContent
            )}
          </div>
          <div>
            {document === undefined ? null : (
              <a
                href={
                  document.doc_url.slice(0, 4) === 'http'
                    ? document.doc_url
                    : `https://${document.doc_url}`
                }
                target="_blank"
              >
                {document.doc_url}
              </a>
            )}
          </div>
          {document !== undefined && document.comments.length > 0 ? (
            <div>
              <List>
                {document.comments.map((comment, index) => (
                  <Fragment key={comment.id}>
                    <DocumentComment
                      comment={comment}
                      documentId={props.documentId}
                      setMsg={props.setMsg}
                    />
                    {index === document.comments.length - 1 ? null : (
                      <Divider />
                    )}
                  </Fragment>
                ))}
              </List>
            </div>
          ) : null}
          <form onSubmit={addComment}>
            <TextField
              label="Add a comment to this document"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              className={classes.textField}
            />
          </form>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(ViewDocumentModal);
