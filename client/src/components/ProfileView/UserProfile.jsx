import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { USERS_QUERY } from '../../graphQL/Queries.js';
import { useQuery } from 'react-apollo-hooks';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useMutation } from '../../graphQL/useMutation';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
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

const StyledAvatar = styled.img`
   {
    border-radius: 100px;
    height: 150px;
    @media (max-width: 850px) {
      height: 130px;
    }
    width: auto;
    margin-right: 20px;
  }
`;

const StyledContainer = styled.div`
   {
    display: flex;
    justify-content: space-between;
    @media (max-width: 850px) {
      flex-direction: column; 
    }
    padding-top: 30px;
  }
`;

const StyledTeams = styled.div`
  /* // border: solid gray 1px;
    display: flex;
    margin-left: 25px;
    flex-direction: column; */
    padding: 12px 12px 0 12px;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 340px;
  button {
    position: absolute;
    top: 14px;
    right: 20px;
  }
  input {
    /* border: solid gray 1px;
      padding: 0px;
      margin-bottom: 20px;
      width: 500px;
      height: 50px;
      border-radius: 15px;
      ::placeholder {
        padding-left: 10px;
      } */
  }
`;

const EDIT_USER = gql`
  mutation EditUser($id: ID!, $name: String, $email: String, $phone: String) {
    updateUserContactInfo(id: $id, name: $name, email: $email, phone: $phone) {
      name
      email
      phone
    }
  }
`;

const styles = theme => ({
  root: {},
  listPaper: {
    overflow: "hidden",
    paddingBottom: "10px",
  },
  listTeamsPaper: {
    height: "279px",
    width: "50%",
    '@media (max-width: 850px)': {
      width: 'auto'
    },
    margin: "0 12px 15px 12px",
    overflow: "auto"
  },
  tabHeaders: {
    textAlign: 'left',
  },
  userSettingInput: {
    marginBottom: '10px',
  },
  userCard: {
    // padding: "0px 60px 20px 60px",
    '@media (max-width: 850px)': {
      width: 'auto'
    },
    position: "relative",
    margin: "0 12px 15px 12px",
    width: "50%",
    overflow: "hidden",
    maxHeight: "279px"
  },
  userCardFlex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "10px 60px 20px 20px",
    marginTop: "20px",
    minWidth: "450px",
  },
  userInfoIcons: {
    position: 'relative',
    top: '5px',
  },
  userInfoTypog: {
    cursor: 'pointer',
    '&:hover svg': {
      opacity: '1',
    },
  },
  myTeamsList: {
    maxHeight: '210px',
    overflow: 'auto',
  },
  pencils: {
    opacity: '1',
    transition: 'opacity 0.2s ease',
  },
  cardAppBar: {
    backgroundColor: theme.palette.secondary.dark
  },
  tabNav: {},
  tabNavCont: {
    margin: "0px 12px 0px 12px",
    overflow: "hidden"
  }
});

const Form = props => {
  
  const { classes } = props;
  const userId = localStorage.getItem('userId');
  // const [name, setName] = useState(null);
  // const [email, setEmail] = useState(null);
  // const [phone, setPhone] = useState(null);
  // const [avatar, setAvatar] = useState(null);
  // const [teams, setTeams] = useState([]);
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
  
  console.log('form user', user);
  
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
    console.log('uop');
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
        {/* <StyledHeader>User Settings</StyledHeader> */}
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
                    // variant="outlined"
                    // label="Name"
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
                      // label="Phone"
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
                    // label="email"
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
              // subheader={<ListSubheader component="h2">My Teams</ListSubheader>}
              className={classes.myTeamsList}
            >
              {/* <StyledHeader2>My Teams</StyledHeader2> */}
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
