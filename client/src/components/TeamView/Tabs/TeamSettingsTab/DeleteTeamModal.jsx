import React, { useState } from "react";
// import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
// import Fab from "@material-ui/core/Fab";
// import AddIcon from "@material-ui/icons/Add";
import { useMutation } from "../../../../graphQL/useMutation";
import Button from "@material-ui/core/Button";
import Modal from '@material-ui/core/Modal';
import Paper from "@material-ui/core/Paper";
import Close from "@material-ui/icons/Close";
import List from "@material-ui/icons/List";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  deleteTeamHeader: {
    color: theme.palette.error.main,
    'font-size': '1.8rem',
    'font-weight': 'bold',
    'text-align': 'center'
  },
  deleteTeamMsg: {
    color: theme.palette.primary.main,
    'text-align': 'left',
    'font-size': '1rem',
    'margin': '50px 0 30px 0',
  },
  deleteInput: {
    width: '100%'
  },
  deleteBtn: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      color: '#ffffff',
      backgroundColor: theme.palette.error.main
    }
  },
  paper: {
    position: "relative",
    top: "15%",
    "max-width": "600px",
    margin: "0 auto",
    "text-align": "left",
    padding: "30px"
  },
  closeBtn: {
    cursor: 'pointer'
  },
  modalHeader: {
    display: 'flex',
    'justify-content': 'flex-end',
  }
})


const DeleteTeamModal = props => {

  const { classes } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.areYouSure}
      >
        <Paper className={classes.paper}>
          <div className={classes.modalHeader}>
            <Close
              className={classes.closeBtn}
              onClick={() => {
                props.setAreYouSure(false);
                props.setDeleteInput('');
              } 
            }
            />
          </div>
          <Typography 
            component="h2"
            className={classes.deleteTeamHeader}  
          >
            {`Do you really want to delete ${props.team.teamName}?`}
          </Typography>
          <Typography
            component="p"
            className={classes.deleteTeamMsg}
          >
            All messages, activities, documents, and todo lists which belong to this team will also be
            deleted. This cannot be undone!
          </Typography>
          <Typography
            component="p"
            className={classes.deleteTeamMsg}
          >
            If you are sure, type the name of the team below.
          </Typography>
          <div className='delete-input-and-btns'>
            <TextField
              className={classes.deleteInput}
              label="Enter team name..."
              margin="normal"
              variant="outlined"
              value={props.deleteInput}
              onChange={props.handleDeleteChange}
            />
            <div className="cancel-delete-team">
              <Button 
                  variant="outlined"
                  onClick={() => {
                    props.setAreYouSure(false);
                    props.setDeleteInput('');
                  } 
                }
              > 
              Cancel
              </Button>
              {props.deleteInput === props.team.teamName &&
                <Button
                  variant="outlined"
                  className={classes.deleteBtn}
                  onClick={props.deleteTeam}
                >
                Delete
                </Button>
              }
            </div>
          </div>
          </Paper>
      </Modal>
    </div>
  )
}

export default withStyles(styles)(DeleteTeamModal);