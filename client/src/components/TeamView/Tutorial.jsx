import React, { useState } from 'react';


import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Close from "@material-ui/icons/Close";
import List from "@material-ui/icons/List";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';



const styles = theme => ({
  tutorialHeader: {
    color: theme.palette.secondary.dark,
    'font-size': '1.8rem',
    'font-weight': 'bold',
    'text-align': 'left'
  },
  tutorialMsg: {
    color: theme.palette.primary.main,
    'text-align': 'left',
    'font-size': '1.5rem',
    'margin': '50px 0 30px 0',
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
  },
})

const Tutorial = props => {
  const [showTutorial, setShowTutorial] = useState(true)

  const closeModal = () => {
    setShowTutorial(false)
  }

  const { classes } = props;

  return (
    <div>
      <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={showTutorial}
        >
          <ClickAwayListener onClickAway={closeModal}>
            <Paper className={classes.paper}>
              <div className={classes.modalHeader}>
                <Close
                  className={classes.closeBtn}
                  onClick={closeModal}
                />
              </div>
              <Typography 
                component="h2"
                className={classes.tutorialHeader}  
              >
                {`You are the only member of ${props.team.teamName}.  It's going to be hard to collaborate with just yourself in here.`}
              </Typography>
              <Typography
                component="p"
                className={classes.tutorialMsg}
              >
                Click on the Settings Tab in the upper right to add more team members and get started!
              </Typography>
            </Paper>
          </ClickAwayListener>
        </Modal>
    </div>
  )
}

export default withStyles(styles)(Tutorial);