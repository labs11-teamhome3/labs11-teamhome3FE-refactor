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
  FOLDERS_QUERY,
  FOLDER_QUERY,
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

const DELETE_FOLDER = gql`
  mutation DELETE_FOLDER($folderId: ID!) {
    deleteFolder(folderId: $folderId) {
      id
    }
  }
`;

const ViewFolderModal = props => {
  const userId = localStorage.getItem('userId')

    console.log('proops', props)
  const findFolder = useQuery(FOLDER_QUERY, {
    variables: { id: props.folderId }
  });
  
  const [deleteFolder] = useMutation(DELETE_FOLDER, {
    update: (cache, { data }) => {
      //console.log('data', data);
      const { findFoldersByTeam } = cache.readQuery({
        query: FOLDERS_QUERY,
        variables: { teamId: props.teamId }
      });
      cache.writeQuery({
        query: FOLDERS_QUERY,
        variables: { teamId: props.teamId },
        data: {
          findFoldersByTeam: findFoldersByTeam.filter(folder => {
            // console.log(`${message.id} - ${props.messageId}`);
            if (folder.id !== props.folderId) {
              return folder;
            }
          })
        }
      });
    },
    variables: {
      folderId: props.folderId
    },
    onCompleted: e => {
      props.setMsg('deleted a message')
      props.toggleModal("viewFolder");
    },
    onError: err => console.log(err)
  });

  const closeModal = _ => {
    props.toggleModal("viewFolder");
  };

  const editMessage = _ => {
    props.toggleModal("editFolder", props.folderId);
    closeModal();
  };

  const { classes } = props;
  const folder = findFolder.data.findFolder;
  console.log('folder', folder)
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
            onClick={deleteFolder}
          >
            Delete
          </Button>
          <h2>
            {folder === undefined
              ? "Loading"
              : folder.title}
          </h2>
          <br />
          {folder !== undefined &&
          folder.documents.length !== undefined ? (
            <div>
              <h3>Documents</h3>
              <ul>
                  {folder.documents.map(document => (
                      <li>{document.title}</li>
                  ))}
              </ul>
              {/* <List>
                {folder.documents.map((document, index) => (
                  <Fragment key={document.id}>
                    <DocumentComment
                      comment={document}
                      documentId={document.id}
                      setMsg={props.setMsg}
                    />
                    {index ===
                    document.length - 1 ? null : (
                      <Divider />
                    )}
                  </Fragment>
                ))}
              </List> */}
            </div> 
          ) : null}
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(ViewFolderModal);