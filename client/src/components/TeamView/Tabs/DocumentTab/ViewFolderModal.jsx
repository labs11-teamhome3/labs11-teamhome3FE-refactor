import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import Button from '@material-ui/core/Button';
import { useMutation } from "../../../../graphQL/useMutation";
import { useQuery } from "react-apollo-hooks";

import { DELETE_FOLDER, REMOVE_DOC_FOLDER } from '../../../../graphQL/Mutations';

import {
  FOLDERS_QUERY,
  FOLDER_QUERY
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

const ViewFolderModal = props => {
  const [documentId, setDocumentId] = useState(null)

  useEffect(() => {
    if(documentId) {
      removeDocumentFromFolder()
    }
  }, [documentId])

  const findFolder = useQuery(FOLDER_QUERY, {
    variables: { id: props.folderId }
  });
  
  const [deleteFolder] = useMutation(DELETE_FOLDER, {
    update: (cache, { data }) => {
      const { findFoldersByTeam } = cache.readQuery({
        query: FOLDERS_QUERY,
        variables: { teamId: props.teamId }
      });
      cache.writeQuery({
        query: FOLDERS_QUERY,
        variables: { teamId: props.teamId },
        data: {
          findFoldersByTeam: findFoldersByTeam.filter(folder => {
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
      props.refetch();
      props.setMsg('deleted a folder');
      props.toggleModal("viewFolder");
    },
    onError: err => console.log(err)
  });

  const [removeDocumentFromFolder] = useMutation(REMOVE_DOC_FOLDER, {
    update: (cache, {data}) => {
      const { findFolder } = cache.readQuery({
        query: FOLDER_QUERY,
        variables: { id: props.folderId }
      });
      cache.writeQuery({
        query: FOLDER_QUERY,
        variables: { id: props.folderId },
        data: {
          findFolder: {...findFolder, documents: findFolder.documents.filter(document => document.id !== data.removeDocumentFromFolder.id)}
        }
      });
    },
    variables: {
      folderId: props.folderId,
      documentId: documentId
    },
    onCompleted: e => {
      props.setMsg('removed a document from a folder');
      setDocumentId(null);
    },
    onError: err => console.log(err)
  })


  const closeModal = _ => {
    props.toggleModal("viewFolder");
  };

  const editMessage = _ => {
    props.toggleModal("editFolder", props.folderId);
    closeModal();
  };

  const { classes } = props;
  const folder = findFolder.data.findFolder;
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
          folder.documents !== undefined &&
          folder.documents !== null && 
          folder.documents.length > 0 ? (
            <div>
              <h3>Documents</h3>
              <ul>
                  {folder.documents.map(document => (
                      <li key={document.id}>
                        {document.title}
                        <Button color="secondary" className={classes.button} onClick={() => setDocumentId(document.id)}>Remove</Button>
                      </li>
                  ))}
              </ul>
            </div> 
          ) : null}
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(ViewFolderModal);