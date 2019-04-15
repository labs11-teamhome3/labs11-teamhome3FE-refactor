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
import { DELETE_DOCUMENT, ADD_COMMENT } from '../../../../graphQL/Mutations';
import {
    DOCUMENTS_QUERY,
    DOCUMENT_QUERY
  } from "../../../../graphQL/Queries";

const styles = theme => ({
  root: {
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    top: 25,
    right: 35,
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
                <Button className={classes.button}>Add Comment</Button>
                <Button className={classes.button} onClick={() => props.toggleModal('view', props.document.id)}>View</Button>
                <Button className={classes.button} onClick={editMessage}>Edit</Button>
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