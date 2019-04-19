import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { useMutation } from '../../../../graphQL/useMutation';
import { useQuery } from 'react-apollo-hooks';
import { DELETE_MESSAGE, ADD_COMMENT } from '../../../../graphQL/Mutations';
import { MESSAGES_QUERY, DOCUMENT_QUERY } from '../../../../graphQL/Queries';

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
  menu: {
    position: 'absolute',
    left: '300px',
    top: '-13px',
  },
});

const MoreMenu = props => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const [deleteMessage] = useMutation(DELETE_MESSAGE, {
    update: (cache, { data }) => {
      const { messages } = cache.readQuery({
        query: MESSAGES_QUERY,
        variables: { teamId: props.teamId },
      });
      cache.writeQuery({
        query: MESSAGES_QUERY,
        variables: { teamId: props.teamId },
        data: {
          messages: messages.filter(message => {
            if (message.id !== data.deleteMessage.id) {
              return message;
            }
          }),
        },
      });
    },
    variables: {
      id: props.message.id,
    },
    onCompleted: e => {
      props.setMsg('deleted a document');
    },
    onError: err => console.log(err),
  });

  const editMessage = _ => {
    setOpen(false);
    props.setMessageEditStatus(!props.messageEditStatus);
  };

  const { classes } = props;
  return (
    <div className={classes.root}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <IconButton className={classes.menu}>
          <MoreVertIcon onClick={handleClick} />
          {open ? (
            <Paper className={classes.paper}>
              <Button className={classes.button} onClick={editMessage}>
                <EditIcon />
              </Button>
              <Button className={classes.button} onClick={deleteMessage}>
                <DeleteForeverIcon />
              </Button>
            </Paper>
          ) : null}
        </IconButton>
      </ClickAwayListener>
    </div>
  );
};

MoreMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MoreMenu);
