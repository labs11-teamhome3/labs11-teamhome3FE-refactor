import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';
import MoreHoriz from '@material-ui/icons/MoreHoriz';

import { useMutation } from "../../../../graphQL/useMutation";
import { useQuery } from "react-apollo-hooks";
import { DELETE_DOCUMENT, ADD_COMMENT, REMOVE_DOC_FOLDER } from '../../../../graphQL/Mutations';
import {
    DOCUMENTS_QUERY,
    DOCUMENT_QUERY,
    FOLDERS_QUERY
  } from "../../../../graphQL/Queries";

const styles = theme => ({
  root: {
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    top: 23,
    right: '75%',
    left: 'auto',
  },
  button: {
      width: '100%',
  }
});

const MoreMenu = props => {
  const [open, setOpen] = useState(false)

    const handleClick = () => {
        setOpen(!open);
    };

    const handleClickAway = () => {
        setOpen(false);
    };

    const [removeDocumentFromFolder] = useMutation(REMOVE_DOC_FOLDER, {
      update: (cache, {data}) => {
        const { findFoldersByTeam } = cache.readQuery({
          query: FOLDERS_QUERY,
          variables: { teamId: props.teamId }
        });
        //console.log('folders', findFoldersByTeam);
        let folder = findFoldersByTeam.find(folder => folder.id === props.folderId)
        //console.log('folder', folder)
        let newDocuments = folder.documents.filter(document => document.id !== props.document.id)
        //console.log('newDocs', newDocuments)
        folder.documents = newDocuments; 
        //console.log('folder', folder)
        let newFolders = findFoldersByTeam.filter(folder => folder.id !== props.folderId)
        //console.log('newFolder', newFolders)
        cache.writeQuery({
          query: FOLDERS_QUERY,
          variables: { teamId: props.teamId },
          data: {
            findFoldersByTeam: [...newFolders, folder]
          }
        });
      },
      variables: {
        folderId: props.folderId,
        documentId: props.document.id
      },
      onCompleted: e => {
        props.setMsg('removed a document from a folder');
      },
      onError: err => console.log(err)
    })

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
            if (document.id !== props.document.id) {
              return document;
            }
          })
        }
      });
    },
    variables: {
      documentId: props.document.id
    },
    onCompleted: e => {
      props.setMsg('deleted a document')
    },
    onError: err => console.log(err)
  });

  const editMessage = _ => {
    props.toggleModal("edit", props.document.id);
  };

    const { classes } = props;
    return (
      <div className={classes.root}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div>
            <MoreHoriz onClick={handleClick}/>
            {open ? (
              <Paper className={classes.paper}>
                <Button className={classes.button} onClick={() => props.toggleModal('view', props.document.id)}>View</Button>
                <Button className={classes.button} onClick={editMessage}>Edit</Button>
                {props.folderDoc ? <Button className={classes.button} onClick={removeDocumentFromFolder}>Remove</Button> : null}
                <Button className={classes.button} onClick={deleteDocument}>Delete</Button>
              </Paper>
            ) : null}
          </div>
        </ClickAwayListener>
      </div>
    );
}

MoreMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MoreMenu);