import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { USERS_QUERY } from '../../graphQL/Queries.js';
import { EDIT_USER} from '../../graphQL/Mutations.js';
import { useQuery } from 'react-apollo-hooks';
import { useMutation } from '../../graphQL/useMutation';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Phone from '@material-ui/icons/Smartphone';
import Email from '@material-ui/icons/Email';
import Pencil from '@material-ui/icons/Edit';
import Toolbar from '@material-ui/core/Toolbar';
import Loader from 'react-loader-spinner';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import {styles, StyledContainer, StyledAvatar, StyledForm, StyledTeams} from './styles/styled.js'

const Form = props => {
  
  const { classes } = props;
  const userId = localStorage.getItem('userId');
  const [editName, setEditName] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editUser] = useMutation(EDIT_USER);
  const [currentTab, setCurrentTab] = useState(0);
  const [user, setUser] = useState(null);
  
  const { data, error, loading } = useQuery(USERS_QUERY);
  
  useEffect(() => {
    if (data.users) {
      setUser(data.users.filter(userData => userData.id === userId)[0]);
    }
  }, [data && data.users]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }
  if (!user) {
    return (
      <Loader type="ThreeDots" height="25px" width="25px" color="#0984e3" />
    );
  }

  const handleTabChange = (e, val) => {
    setCurrentTab(val);
  };

  const updateInfo = e => {
    e.preventDefault();
    setEditName(false);
    editUser({
      variables: {
        id: userId,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    });
  };

  return (
    <div className={classes.root}>
      <div>
        <StyledContainer>
          <Paper className={classes.userCard}>
            <AppBar
              position="static"
              className={[classes.cardAppBar, classes.redBar]}
              elevation="1"
            >
              <Toolbar>
                <Typography variant="h6" color="inherit">
                  Information
                </Typography>
              </Toolbar>
            </AppBar>
            <div className={classes.userCardFlex}>
              <StyledAvatar src={user.profilePic} alt="avatar" />

              <StyledForm onSubmit={updateInfo}>
                {editName ? (
                  <TextField
                    onChange={e => setUser({ ...user, name: e.target.value })}
                    value={user.name}
                    className={classes.userSettingInput}
                    fullWidth
                  />
                ) : (
                  <Typography
                    variant="h5"
                    gutterBottom
                    onClick={_ => setEditName(true)}
                    className={classes.userInfoTypog}
                  >
                    {user.name} <Pencil className={classes.pencils} />
                  </Typography>
                )}
                {editPhone ? (
                  
                    <TextField
                      onChange={e => setUser({ ...user, phone: e.target.value })}
                      value={user.phone}
                      className={classes.userSettingInput}
                      fullWidth
                    />
                  
                ) : (
                  <Tooltip title={user.phone ? "Edit phone number" : "Add to receive text notifications"} placement="right-end">
                    <Typography
                      variant="h6"
                      gutterBottom
                      onClick={_ => setEditPhone(true)}
                      className={classes.userInfoTypog}
                    >
                      <Phone className={classes.userInfoIcons} />
                      {user.phone} <Pencil className={classes.pencils} />
                    </Typography>
                  </Tooltip>
                )}
                {editEmail ? (
                  <TextField
                    onChange={e => setUser({ ...user, email: e.target.value })}
                    value={user.email}
                    fullWidth
                  />
                ) : (
                  <Tooltip title={user.email ? "Edit email address" : "Add to receive email notifications"} placement="right-end">
                    <Typography
                      variant="h6"
                      gutterBottom
                      onClick={_ => setEditEmail(true)}
                      className={classes.userInfoTypog}
                    >
                      <Email className={classes.userInfoIcons} /> {user.email}{' '}
                      <Pencil className={classes.pencils} />
                    </Typography>
                  </Tooltip>
                )}

                {editName || editPhone || editEmail ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    onClick={e => {
                      e.preventDefault();
                      setEditName(false);
                      setEditPhone(false);
                      setEditEmail(false);
                      editUser({
                        variables: {
                          id: userId,
                          name: user.name,
                          phone: user.phone,
                          email: user.email,
                        },
                      });
                    }}
                  >
                    {' '}
                    Save
                  </Button>
                ) : null}
              </StyledForm>
            </div>
          </Paper>
          <Paper className={classes.listTeamsPaper}>
            <AppBar
              position="static"
              color="primary"
              className={classes.cardAppBar}
              elevation="1"
            >
              <Toolbar>
                <Typography variant="h6" color="inherit">
                  Manage Teams
                </Typography>
              </Toolbar>
            </AppBar>
            <List
              className={classes.myTeamsList}
            >
              {user.inTeam &&
                user.inTeam.length > 0 &&
                user.inTeam.map((team, index) => (
                  <Link key={team.id} to={`/teams/${team.id}/home`}>
                    {' '}
                    <Divider />
                    <ListItem button>
                      <Tooltip title="View team" TransitionComponent={Zoom} placement="bottom-start">
                        <ListItemText>{team.teamName}</ListItemText>
                      </Tooltip>
                    </ListItem>
                    {index === user.inTeam.length - 1 && <Divider />}
                  </Link>
                ))}
              {user.inTeam && user.inTeam.length < 1 && (
                <Link to="teams/first-team">Create a team</Link>
              )}
            </List>
          </Paper>
        </StyledContainer>
      </div>
        <Paper className={classes.tabNavCont}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            className={classes.tabNav}
          >
            <Tab label="My Activity" />
            <Tab label="Owned TodoLists" />
            <Tab label="Assigned TodoLists" />
          </Tabs>
        </Paper>
        {currentTab === 0 && (
          <>
            <StyledTeams>
              <Paper className={classes.listPaper}>
                <AppBar
                  position="static"
                  color="primary"
                  className={classes.cardAppBar}
                  elevation="1"
                >
                  <Toolbar>
                    <Typography variant="h6" color="inherit">
                      Activity
                    </Typography>
                  </Toolbar>
                </AppBar>
                <List>
                  {user.events &&
                    user.events.map((event, index) => {
                      return (
                        <>
                          <Divider />
                          <ListItem>
                            <ListItemText>
                              {event.action_string} in {event.team.teamName}
                            </ListItemText>
                          </ListItem>
                          {index === user.events.length - 1 && <Divider />}
                        </>
                      );
                    })}
                </List>
              </Paper>
            </StyledTeams>
          </>
        )}
        {currentTab === 1 && (
          <>
            <StyledTeams>
              <Paper className={classes.listPaper}>
                <AppBar
                  position="static"
                  color="primary"
                  className={classes.cardAppBar}
                  elevation="1"
                >
                  <Toolbar>
                    <Typography variant="h6" color="inherit">
                      Owned Lists
                    </Typography>
                  </Toolbar>
                </AppBar>
                <List>
                  {user.todoListsOwned &&
                    user.todoListsOwned.map((list, index) => {
                      return (
                        <>
                          <Divider />
                          <ListItem>
                            <ListItemText>
                              {list.description} in {list.inTeam.teamName}
                            </ListItemText>
                          </ListItem>
                          {index === user.todoListsOwned.length - 1 && (
                            <Divider />
                          )}
                        </>
                      );
                    })}
                </List>
              </Paper>
            </StyledTeams>
          </>
        )}

        {currentTab === 2 && (
          <>
            <StyledTeams>
              <Paper className={classes.listPaper}>
                <AppBar
                  position="static"
                  color="primary"
                  className={classes.cardAppBar}
                  elevation="1"
                >
                  <Toolbar>
                    <Typography variant="h6" color="inherit">
                      Assigned Lists
                    </Typography>
                  </Toolbar>
                </AppBar>
                <List>
                  {user.todoListsAssigned &&
                    user.todoListsAssigned.map((list, index) => {
                      return (
                        <>
                          <Divider />
                          <ListItem>
                            <ListItemText>
                              {list.description} in {list.inTeam.teamName}
                            </ListItemText>
                          </ListItem>
                          {index === user.todoListsAssigned.length - 1 && (
                            <Divider />
                          )}
                        </>
                      );
                    })}
                </List>
              </Paper>
            </StyledTeams>
          </>
        )}
    </div>
  );
};

export default withStyles(styles)(Form);
