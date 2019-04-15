import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import AccountCircle from "@material-ui/icons/AccountCircle";
import Manaje from '../../../../assets/Manaje.png'

const styles = theme => ({
  root: {
    marginBottom: "10px"
  },
  userPic: {
    height: '50px',
    width: '50px',
    borderRadius: '50px',
    margin: '4px 12px 0 0'
  }
});

const Message = props => {
  const { classes } = props;
  return (
    <div>
      {props.message.creator.profilePic ? 
        <img className={classes.userPic} src={props.message.creator.profilePic} alt="profile picture"/> 
        : 
        <AccountCircle className={classes.userPic}/>} 
    </div>
  );
};

export default withStyles(styles)(Message);
