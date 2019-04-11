import React, { useState, useEffect, Fragment } from "react";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import DropArrow from "@material-ui/icons/ArrowDropDown";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Button from '@material-ui/core/Button';
import { useMutation } from "../../../../graphQL/useMutation";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";

import DocumentComment from "./DocumentComment";
import { CREATE_EVENT } from '../../../../graphQL/Mutations';

import {
  FOLDERS_QUERY,
  FOLDER_QUERY,
  DOCUMENTS_QUERY,
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
      title
      documents {
        id 
        doc_url
        title 
        user {
          id
          name
        }
        team {
          id
        }
        textContent
        folder {
            id
          }
        comments {
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
    }
  }
`;

const REMOVE_DOC_FOLDER = gql`
  mutation REMOVE_DOC_FOLDER($folderId: ID! $documentId: ID!) {
    removeDocumentFromFolder(folderId: $folderId, documentId: $documentId) {
      id 
      doc_url
      title 
      user {
        id
        name
      }
      team {
        id
      }
      textContent
      folder {
          id
        }
      comments {
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
  }
`;

const ViewFolderModal = props => {
  const userId = localStorage.getItem('userId')
  const [documentId, setDocumentId] = useState(null)
  const [documentsInFolder, setDocumentsInFolder] = useState([])

  useEffect(() => {
    if(findFolder.data.documents.length) {
      setDocumentsInFolder(findFolder.data.documents)
    }
  }, [findFolder.data])

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
      const { findDocumentsByTeam } = cache.readQuery({
        query: DOCUMENTS_QUERY,
        variables: { teamId: props.teamId }
      });
      console.log('data delete', data.deleteFolder)
      cache.writeQuery({
        query: DOCUMENTS_QUERY,
        variables: { teamId: props.teamId },
        data: {
          findDocumentsByTeam: findDocumentsByTeam.map(document => {
            return documentsInFolder.map(documentInFolder => {
             if( document.id === documentInFolder.id) {
              return documentInFolder
             } else {
               return document
             }
            })
          })
        }
      });
    },
    variables: {
      folderId: props.folderId
    },
    onCompleted: e => {
      console.log('e', e)
      props.setMsg('deleted a folder')
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
      // const { findDocumentsByTeam } = cache.readQuery({
      //   query: DOCUMENTS_QUERY,
      //   variables: { teamId: props.teamId }
      // });
      // cache.writeQuery({
      //   query: DOCUMENTS_QUERY,
      //   variables: { teamId: props.teamId },
      //   data: {
      //     findDocumentsByTeam: findDocumentsByTeam.map(document => {
      //       if(document.id === data.removeDocumentFromFolder.id) {
      //         return data.removeDocumentFromFolder
      //       } else {
      //         return document
      //       }
      //     })
      //   }
      // });
    },
    variables: {
      folderId: props.folderId,
      documentId: documentId
    },
    onCompleted: e => {
      props.setMsg('removed a document from a folder');
      setDocumentId(null);
      //props.toggleModal("viewFolder");
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