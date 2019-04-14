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
    top: 36,
    right: 0,
    left: 0,
  },
  fake: {
    backgroundColor: grey[200],
    height: theme.spacing.unit,
    margin: theme.spacing.unit * 2,
    // Selects every two elements among any group of siblings.
    '&:nth-child(2n)': {
      marginRight: theme.spacing.unit * 3,
    },
  },
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
    const fake = <Button className={classes.fake}>Delete</Button>;

    return (
      <div className={classes.root}>
        <ClickAwayListener onClickAway={this.handleClickAway}>
          <div>
            <MoreHoriz onClick={this.handleClick}/>
            {open ? (
              <Paper className={classes.paper}>
                <Button>View</Button>
                <Button>Edit</Button>
                {fake}
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