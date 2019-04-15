import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';
import MoreHoriz from '@material-ui/icons/MoreHoriz';

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

class MoreMenu extends React.Component {
  state = {
    open: false,
  };

  handleClick = () => {
    this.setState(state => ({
      open: !state.open,
    }));
  };

  handleClickAway = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <ClickAwayListener onClickAway={this.handleClickAway}>
          <div>
            <MoreHoriz onClick={this.handleClick}/>
            {open ? (
              <Paper className={classes.paper}>
                <Button className={classes.button}>Add Comment</Button>
                <Button className={classes.button}>View</Button>
                <Button className={classes.button}>Edit</Button>
                <Button className={classes.button}>Delete</Button>
              </Paper>
            ) : null}
          </div>
        </ClickAwayListener>
      </div>
    );
  }
}

MoreMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MoreMenu);