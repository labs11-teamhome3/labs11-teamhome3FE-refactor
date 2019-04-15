import React from "react";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Manaje from '../../../../assets/Manaje.png'

const styles = theme => ({
  root: {
    display: 'flex',
    marginTop: "15px",
  },
  userPic: {
    height: '50px',
    width: '50px',
    borderRadius: '50px',
    margin: '4px 12px 0 0'
  },
  name: {
    fontWeight: 'bold',
    marginRight: '10px'
  },
  time: {

  }
});

const Message = props => {
  const { classes } = props;
  const user = props.message.creator;
  return (
    <div className={classes.root}>
      {user.profilePic ? 
        <img className={classes.userPic} src={user.profilePic} alt="profile picture"/> 
        : 
        <AccountCircle className={classes.userPic}/>} 
        <div className={classes.root}>
          <div>
            <div className={classes.name}>{user.name}</div>
            <div className={classes.time}>{moment(props.message.createdAt).startOf('minute').fromNow()}</div>
          <h5>{props.message.content}</h5>    
          </div>
        </div>
    </div>
  );
};

export default withStyles(styles)(Message);
