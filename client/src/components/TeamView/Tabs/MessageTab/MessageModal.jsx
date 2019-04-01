import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import DropArrow from "@material-ui/icons/ArrowDropDown";

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
  }
});

const MessageModal = props => {
  const [messageInfo, setMessageInfo] = useState({
    title: "",
    description: ""
  });

  const handleChange = e => {
    setMessageInfo({
      ...messageInfo,
      [e.target.name]: e.target.value
    });
  };

  const { classes } = props;
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.modalStatus}
      >
        <Paper className={classes.paper}>
          <Close onClick={props.toggleModal} />
          <br />
          <input
            type="text"
            value={messageInfo.title}
            onChange={handleChange}
            name="title"
            placeholder="Message Title"
            className={classes.messageInput}
          />
          <br />
          <textarea
            name="description"
            onChange={handleChange}
            cols="30"
            rows="10"
            value={messageInfo.description}
            placeholder="Message Content"
            className={classes.messageInput}
          />
          <br />
          <Button>Save</Button>
          {/* {props.editing ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
            >
              Delete List
              <DeleteIcon />
              <DropArrow />
            </Button>
          ) : null} */}
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(MessageModal);
