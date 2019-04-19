import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Close from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { useMutation } from '../../../../graphQL/useMutation';
import { useQuery } from 'react-apollo-hooks';
import { DELETE_FOLDER, ADD_COMMENT } from '../../../../graphQL/Mutations';
import { FOLDERS_QUERY, DOCUMENT_QUERY } from '../../../../graphQL/Queries';

const styles = theme => ({
  root: {
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    top: 22,
    right: '73%',
    left: 'auto',
  },
  button: {
    width: '100%',
  },
});

const MoreMenuFolder = props => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const [deleteFolder] = useMutation(DELETE_FOLDER, {
    update: (cache, { data }) => {
      const { findFoldersByTeam } = cache.readQuery({
        query: FOLDERS_QUERY,
        variables: { teamId: props.teamId },
      });
      cache.writeQuery({
        query: FOLDERS_QUERY,
        variables: { teamId: props.teamId },
        data: {
          findFoldersByTeam: findFoldersByTeam.filter(folder => {
            if (folder.id !== props.folder.id) {
              return folder;
            }
          }),
        },
      });
    },
    variables: {
      folderId: props.folder.id,
    },
    onCompleted: e => {
      props.refetch();
      props.refetchDocs();
      props.setMsg('deleted a folder');
    },
    onError: err => console.log(err),
  });

  const editFolder = _ => {
    setOpen(false);
    props.setTitleEditStatus(!props.titleEditStatus);
  };

  const { classes } = props;
  return (
    <div className={classes.root}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <MoreHoriz onClick={handleClick} />
          {open ? (
            <Paper className={classes.paper}>
              {props.expandedStatus ? (
                <Button
                  className={classes.button}
                  onClick={() => {
                    props.setExpandedStatus(!props.expandedStatus);
                    handleClickAway();
                  }}
                >
                  <Close />
                </Button>
              ) : (
                <Button
                  className={classes.button}
                  onClick={() => props.setExpandedStatus(!props.expandedStatus)}
                >
                  <SearchIcon />
                </Button>
              )}
              <Button className={classes.button} onClick={editFolder}>
                <EditIcon />
              </Button>
              <Button className={classes.button} onClick={deleteFolder}>
                <DeleteForeverIcon />
              </Button>
            </Paper>
          ) : null}
        </div>
      </ClickAwayListener>
    </div>
  );
};

MoreMenuFolder.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MoreMenuFolder);
