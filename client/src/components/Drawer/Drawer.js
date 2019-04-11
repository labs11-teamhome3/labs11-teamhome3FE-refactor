import React, { useState, useEffect } from 'react';
import { useMutation } from '../../graphQL/useMutation';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

// components //
import TabNavigator from '../../components/TeamView/TabNavigator'
import ActivityTimeline from '../TeamView/Tabs/ActivityTimelineTab/ActivityTimelineTab';
import NavigationView from '../../views/NavigationView';
import DashboardView from '../../views/DashboardView';

// queries //
import { CREATE_EVENT } from '../../graphQL/Mutations';
import {
  MESSAGES_QUERY,
  USERS_QUERY,
  MESSAGE_QUERY,
  EVENTS_QUERY
} from "../../graphQL/Queries";

const drawerWidth = 400;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

const PersistentDrawerLeft = props => {
    const userId = localStorage.getItem('userId')
//   state = {
//     open: false,
//   };

  const [open, setOpen] = useState(true)
  const [msg, setMsg] = useState(null);

  useEffect( _ => {
    createEvent();
  }, [msg])

  const [createEvent] = useMutation(CREATE_EVENT, {
    update: (cache, { data }) => {
      // console.log(data.createMessage)
      const {findEventsByTeam} = cache.readQuery({
        query: EVENTS_QUERY,
        variables: { teamId: props.match.params.id },
      });
      cache.writeQuery({
        query: EVENTS_QUERY,
        variables: { teamId: props.match.params.id },
        data: { findEventsByTeam: [...findEventsByTeam, data.addEvent] },
      });
    },
    variables: {
      action_string: msg,
      object_string: '',
      userId: userId,
      teamId: props.match.params.id,
    },
    onCompleted: e => {
    },
    onError: err => console.log(err),
  });

  const handleDrawerOpen = () => {
    // this.setState({ open: true });
    setOpen(true)
  };

  const handleDrawerClose = () => {
    // this.setState({ open: false });
    setOpen(false)
  };

//   render() {
    // const { classes, theme } = this.props;
    const { classes, theme } = props;

    // const { open } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <div className="header">
                <div className="logo">
                    <Link to="/dashboard">
                    <img className="logo-img" src={props.logo} alt="Manaje" />
                    </Link>
                </div>
                {!localStorage.getItem('userId') ? (
                    <div className="nav-btns">
                        <Button onClick={props.login}>Log in</Button>
                        <Button onClick={props.signup}>Sign Up</Button>
                    </div>
                ) : (
                    <div className="nav-btns">
                        {/* <Link to="/dashboard">
                            <Button>Dashboard</Button>
                        </Link> */}
                        <Link to="/profile">
                            <Button>Profile</Button>
                        </Link>
                        <Button onClick={props.logout}>Log out</Button>
                    </div>
                )}
        </div>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <DashboardView match={props.match}/>
          <Divider />
          <ActivityTimeline setMsg={setMsg} teamId={props.match.params.id} />
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <TabNavigator 
            match = {props.match} 
            history = {props.history}
            setMsg = {setMsg}  
            >
          </TabNavigator>
        </main>
      </div>
    );
//   }
}

PersistentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PersistentDrawerLeft);