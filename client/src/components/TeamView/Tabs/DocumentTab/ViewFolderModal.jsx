import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import Button from '@material-ui/core/Button';
import FolderIcon from "@material-ui/icons/Folder";
import { useMutation } from "../../../../graphQL/useMutation";
import { useQuery } from "react-apollo-hooks";

import { DELETE_FOLDER, REMOVE_DOC_FOLDER } from '../../../../graphQL/Mutations';

import {
  FOLDERS_QUERY,
  FOLDER_QUERY
} from "../../../../graphQL/Queries";

const styles = theme => ({
  paper: {
    position: 'relative',
    top: '24%',
    'max-width': '600px',
    margin: '0 auto',
    'text-align': 'left',
    padding: '30px',
  },
  viewFolder: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '25px'
  },
  button: {
    margin: '5px 0px 5px 7px'
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
          <div className={classes.viewFolder}>
            <div>
              <FolderIcon />
              <div>
                {folder === undefined
                  ? "Loading"
                  : folder.title}
              </div>
            </div>
            <Close onClick={closeModal} />
          </div>
          {folder !== undefined &&
          folder.documents !== undefined &&
          folder.documents !== null && 
          folder.documents.length > 0 ? (
            <div>
              <h4>Documents</h4>
              <ul>
                  {folder.documents.map(document => (
                      <li key={document.id}>
                        Title: {document.title} | Created By: {document.user.name}
                        <Button 
                          variant="outlined"
                          className={classes.button} 
                          onClick={() => {
                            props.toggleModal('viewFolder');
                            props.toggleModal('view', document.id) 
                        }}>
                          View
                        </Button>
                        <Button color="secondary" className={classes.button} onClick={() => setDocumentId(document.id)}>Remove</Button>
                      </li>
                  ))}
              </ul>
            </div> 
          ) : <h4>This folder is empty 🤭</h4>}
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(ViewFolderModal);