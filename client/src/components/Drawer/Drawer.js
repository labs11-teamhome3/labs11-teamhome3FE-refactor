import React, { useState, useEffect } from 'react';
import { useMutation } from '../../graphQL/useMutation';
import { useQuery } from "react-apollo-hooks";
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CloseIcon from '@material-ui/icons/Close';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Typography from '@material-ui/core/Typography';

// components //
import TabNavigator from '../../components/TeamView/TabNavigator'
import ActivityTimeline from '../TeamView/Tabs/ActivityTimelineTab/ActivityTimelineTab';
import DashboardView from '../../views/DashboardView';

// queries //
import { CREATE_EVENT } from '../../graphQL/Mutations';
import { EVENTS_QUERY } from "../../graphQL/Queries";

// css //
import './css/Drawer.css'

const drawerWidth = 375;

const styles = theme => ({
  root: {
    display: 'flex',
    backgroundColor: '#ffffff',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // slivers 
    // backgroundColor: '#005b9f',
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
    // slot
    width: drawerWidth,
    height: '100vh',
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    '@media (max-width: 675px)': {
      width: '100%',
      maxWidth: '675px',
      minWidth: '375px'
    },
    // top
    backgroundColor: theme.palette.primary.dark,
    borderBottom: ' solid #5862DF 1px',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    height: '74px',
    minHeight: '74px'
  },
  content: {
    width: '30%',
    minWidth: '500px',
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
  closeIcon: {
    color: '#ffffff'
  },
  icon: {
    '&:hover': {
      backgroundColor: theme.palette.primary.light
    }
  },
  menu: {
    '@media (max-width: 675px)': {
      display: 'inline',
      color: '#ffffff',
      width: '100%',
      textAlign: 'center',
      fontSize: '1.9rem'
    },
    display: 'none'
  }
});

const PersistentDrawerLeft = props => {
  const userId = localStorage.getItem('userId')

  const [open, setOpen] = useState(true)
  const [msg, setMsg] = useState(null);

  useEffect( _ => {
    createEvent();
  }, [msg])

  const [createEvent] = useMutation(CREATE_EVENT, {
    update: (cache, { data }) => {
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
    setOpen(true)
  };

  const handleDrawerClose = () => {
    setOpen(false)
  };

    const { classes, theme } = props;
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
                {/* <div className="logo">
                    <img className="logo-img" src={props.logo} alt="Manaje" />
                </div> */}
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
                            {/* {picQuery.data.user && picQuery.data.user.profilePic ? 
                              <img 
                                className="nav-profile-pic" 
                                src={picQuery.data.user.profilePic} 
                                alt="profile" 
                              /> :
                              <img 
                                className="nav-profile-pic" 
                                src='http://chittagongit.com//images/default-user-icon/default-user-icon-8.jpg'
                                alt="profile" 
                            /> } */}  <Button>Profile</Button> 
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
          <div className={classes.drawerHeader} style={{minHeight: '74px'}}>
            <Typography component='h3' className={classes.menu}>Menu</Typography>
            <IconButton className={classes.icon} onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <CloseIcon className={classes.closeIcon} /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <DashboardView history={props.history} match={props.match}/>
          <Divider />
          {userId &&
            <ActivityTimeline setMsg={setMsg} teamId={props.match.params.id} />
          }
        </Drawer>
        {userId &&
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
        }
      </div>
    );
//   }
}

PersistentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PersistentDrawerLeft);