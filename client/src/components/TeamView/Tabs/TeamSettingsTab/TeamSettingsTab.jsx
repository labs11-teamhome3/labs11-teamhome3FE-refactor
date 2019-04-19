import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
// import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from '@material-ui/icons/Delete';
import { useMutation } from '../../../../graphQL/useMutation';
import gql from 'graphql-tag';

///Components///
import TeamInfo from './TeamInfo';
import StripePaymentPopup from '../../../Stripe/StripePaymentPopup';
import Loader from 'react-loader-spinner';
import AddNewMember from './AddNewMember';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

////Queries////
import { TEAMS_QUERY, USERS_QUERY, CURRENT_USER_QUERY, TEAM_QUERY } from '../../../../graphQL/Queries';
import { useQuery } from 'react-apollo-hooks';

/// css ///
import './css/TeamSettings.css';
import { Typography } from '@material-ui/core';

const DELETE_TEAM = gql`
  mutation deleteTeam($id: ID!) {
    deleteTeam(id: $id) {
      id
    }
  }
`;



const ADD_MEMBER = gql`
  mutation ADD_MEMBER($userId: ID!, $teamId: ID!) {
    addUserToTeam(userId: $userId, teamId: $teamId) {
      id
      teamName
      members {
        id
        name
        role
        profilePic
      }
    }
  }
`;

const styles = theme => ({
  findMember: {
    width: '100%',
  },
});

const TeamSettingsTab = props => {
  const userId = localStorage.getItem('userId');

  const [deleteInput, setDeleteInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [newMember, setNewMember] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [areYouSure, setAreYouSure] = useState(false);
  const [showSearchMember, setShowSearchMember] = useState(false)

  useEffect(() => {
    setAreYouSure(false);
    setShowSearchMember(false);
    setDeleteInput('');
  }, [props.match.params.id])

  const handleDeleteChange = e => {
    setDeleteInput(e.target.value);
  };

  const handleSearchChange = e => {
    setSearchInput(e.target.value);
  };

  const handleAddMemberSubmit = e => {
    e.preventDefault();
  };

  const showSelectMember = () => {
    setShowSearchMember(!showSearchMember);
    setSearchInput('');
  }

  // get the current user for conditional rendering of removal buttons based on ADMIN status
  const userQuery = useQuery(CURRENT_USER_QUERY, {
    variables: {
      id: localStorage.getItem('userId'),
    },
  });

  // console.log('uq', userQuery);

  let userRole = '';
  let currentUser;
  if (userQuery.data.user) {
    //console.log('user', userQuery.data.user)
    currentUser = userQuery.data.user;
    userRole = userQuery.data.user.role;
    // console.log(userRole);
  }

  const { data, error, loading } = useQuery(TEAM_QUERY, {
    variables: { id: props.teamId },
  });

  //   console.log("team settings data", data);
  const [deleteTeam] = useMutation(DELETE_TEAM, {
    update: (cache, { data }) => {
      const { user } = cache.readQuery({ query: CURRENT_USER_QUERY, variables: { id: userId }});
      cache.writeQuery({
        query: CURRENT_USER_QUERY,
        variables: {
          id: userId
        },
        data: 
          { user: 
            {
              ...user,
              inTeam: user.inTeam.filter(team => team.id !== data.deleteTeam.id)
            }
          }
      });
    },
    variables: { id: props.teamId },
    onCompleted: e => {
      if (currentUser.inTeam.length > 1) {
        props.history.push(`/teams/${currentUser.inTeam[0].id}/home`);
      } else {
        props.history.push(`/teams/first-team`);
      }
      // reload the window to remove the team.  NEEDS TO BE FIXED
      // window.location.reload();
    },
    onError: err => console.log(err),
  });

  // mutation for adding user
  const [addUserToTeam] = useMutation(ADD_MEMBER, {
    update: (cache, { data }) => {
      // console.log('data', data);
      const { team } = cache.readQuery({
        query: TEAM_QUERY,
        variables: { id: props.match.params.id },
      });
      // console.log('team', team)
      cache.writeQuery({
        query: TEAM_QUERY,
        variables: { id: props.match.params.id },
        data: {
          team: {
            ...team,
            members: [...team.members],
          },
        },
      });
    },
    variables: {
      userId: newMemberId,
      teamId: props.match.params.id,
    },
    onCompleted: e => {
      props.setMsg(`added ${newMember} to the team`);
      setNewMember('');
      setNewMemberId('');
    },
    onError: err => {
      // console.log(err.message);
      setErrorMsg(err.message);
    },
  });

  // query all users to populate list for adding member to team
  const allUsersQuery = useQuery(USERS_QUERY);
  // console.log('auq', allUsersQuery);

  // setup array of current member id's so we can filter them out of add new member .map
  let memberIds = [];
  if (data.team) {
    data.team.members.forEach(member => memberIds.push(member.id))
  }

  if (loading) {
    return (
      <div>
        <Loader type="ThreeDots" height="25px" width="25px" color="#0984e3" />
      </div>
    );
  }

  if (error) {
    return <div>Error! {error.message}</div>;
  }

  const { classes } = props;

  return (
    <div className="team-settings-page">
        <div className="add-user">
          <form onSubmit={handleAddMemberSubmit}>
            {allUsersQuery.loading && (
              <Loader
                type="ThreeDots"
                height="25px"
                width="25px"
                color="#0984e3"
              />
            )}
            {allUsersQuery.data.users && (
              <>
                <Button 
                  className="add-team-member-or-cancel"
                  color={showSearchMember ? "secondary" : "primary"} 
                  variant={showSearchMember ? "outlined" : "contained"}
                  onClick={showSelectMember}
                >
                  {showSearchMember ? "Close" : "Add Team Member"}
                </Button>
                {showSearchMember &&
                  <>
                  <TextField
                    className={classes.findMember}
                    label="new team member name"
                    helperText="Search our database of users"
                    margin="normal"
                    variant="outlined"
                    value={searchInput}
                    onChange={handleSearchChange}
                  />
                  <div className="all-members">
                    {errorMsg && (
                        <div className="error-flash">
                          <Typography component="h3">
                            {errorMsg.split(':')[1]}
                          </Typography>
                          <div className="premium-or-cancel">
                            <StripePaymentPopup teamId={props.teamId} />
                            <Button variant="outlined" onClick={() => setErrorMsg('')}>Cancel</Button>
                          </div>
                        </div>
                    )}
                    {allUsersQuery.data.users &&
                      searchInput &&
                      allUsersQuery.data.users
                          .filter(user => !memberIds.includes(user.id))
                          .map(user => {
                            if (
                              user.name
                                .toLowerCase()
                                .includes(searchInput.toLowerCase())
                            ) {
                              return (
                                <AddNewMember
                                  user={user}
                                  key={user.id}
                                  newMemberId={newMemberId}
                                  setNewMemberId={setNewMemberId}
                                  setNewMember={setNewMember}
                                  addUserToTeam={addUserToTeam}
                                />
                              );
                            }
                        })}
                  </div>
                  </>
                }
              </>
            )}
          </form>
        </div>
        <div className="team-settings">
          <TeamInfo
            team={data.team}
            match={props.match}
            userRole={userRole}
            setMsg={props.setMsg}
            deleteTeam={deleteTeam}
            areYouSure={areYouSure}
            setAreYouSure={setAreYouSure}
            deleteInput={deleteInput}
            setDeleteInput={setDeleteInput}
            handleDeleteChange={handleDeleteChange}
          />
        </div>
    </div>
  );
};

export default withStyles(styles)(TeamSettingsTab);
