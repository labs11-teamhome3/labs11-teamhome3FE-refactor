import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
// import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { useMutation } from "../../../../graphQL/useMutation";
import gql from "graphql-tag";

///Components///
import TeamInfo from "./TeamInfo";
import StripePaymentPopup from "../../../Stripe/StripePaymentPopup";
import Loader from 'react-loader-spinner';
import AddNewMember from './AddNewMember';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles'


////Queries////
import { TEAMS_QUERY, USERS_QUERY } from "../../../../graphQL/Queries";
import { useQuery } from "react-apollo-hooks";

/// css ///
import "./css/TeamSettings.css";

const DELETE_TEAM = gql`
  mutation deleteTeam($id: ID!) {
    deleteTeam(id: $id) {
      id
    }
  }
`;

const TEAM_QUERY = gql`
  query team($id: ID!) {
    team(id: $id) {
      id
      teamName
      premium
      members {
        id
        name
        role
        profilePic
      }
    }
  }
`;

const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY($id: ID!) {
    user(id: $id) {
      id
      name
      role
      inTeam {
        id
      }
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
    width: '100%'
  }
})

const TeamSettingsTab = props => {
  const [deleteInput, setDeleteInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [newMember, setNewMember] = useState("");
  const [newMemberId, setNewMemberId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  // const [currentUser, setCurrentUser] = useState(null)

  // useEffect(() => {
  //   setCurrentUser(userQuery.data.user)
  // }, [currentUser])

  const handleDeleteChange = e => {
    setDeleteInput(e.target.value);
  };

  const handleSearchChange = e => {
    setSearchInput(e.target.value);
  };

  const handleAddMemberSubmit = e => {
    e.preventDefault();
  };

  const [areYouSure, setAreYouSure] = useState(false);
  // get the current user for conditional rendering of removal buttons based on ADMIN status
  const userQuery = useQuery(CURRENT_USER_QUERY, {
    variables: {
      id: localStorage.getItem("userId")
    }
  });
  let userRole = "";
  let currentUser;
  if (userQuery.data.user) {
    //console.log('user', userQuery.data.user)
    currentUser = userQuery.data.user;
    userRole = userQuery.data.user.role;
  }

  const { data, error, loading } = useQuery(TEAM_QUERY, {
    variables: { id: props.teamId }
  });
  //   console.log("team settings data", data);
  const [deleteTeam] = useMutation(DELETE_TEAM, {
    update: (cache, { data }) => {
      const { teams } = cache.readQuery({ query: TEAMS_QUERY });
      cache.writeQuery({
        query: TEAMS_QUERY,
        data: { teams: teams.filter(team => team.id !== data.deleteTeam.id) }
      });
    },
    variables: { id: props.teamId },
    onCompleted: e => {
      console.log("currentUser", currentUser);
      if (currentUser.inTeam.length > 1) {
        props.history.push(`/teams/${currentUser.inTeam[0].id}/home`);
      } else {
        props.history.push(`/teams/first-team`);
      }
      // reload the window to remove the team.  NEEDS TO BE FIXED
      window.location.reload();
    },
    onError: err => console.log(err)
  });

  // mutation for adding user
  const [addUserToTeam] = useMutation(ADD_MEMBER, {
      update: (cache, { data }) => {
          // console.log('data', data);
          const { team } = cache.readQuery({
              query: TEAM_QUERY,
              variables: { id: props.match.params.id }
            });
            // console.log('team', team)
            cache.writeQuery({
                query: TEAM_QUERY,
                variables: { id: props.match.params.id },
                data: {
                    team: {
                        ...team,
                        members: [...team.members]
                    }
                }
            })
        },
        variables: {
          userId: newMemberId,
          teamId: props.match.params.id
        },
        onCompleted: e => {
          props.setMsg(`added ${newMember} to the team`);
          setSearchInput("");
          setNewMember("");
          setNewMemberId("");
        },
        onError: err => {
          // console.log(err.message);
          setErrorMsg(err.message);
        }
      });

  // query all users to populate dropdown for adding member to team
  const allUsersQuery = useQuery(USERS_QUERY);
  // set up options for the add a member <select> element
  let optionsItems;
  if (allUsersQuery.data.users) {
    optionsItems = allUsersQuery.data.users.map(user => (
      <option className="selected-member" data-id={user.id} key={user.id}>
        {user.name}
      </option>
    ));
  }

if(loading) {
    return <div>
      <Loader
        type="ThreeDots"
        height="25px"
        width="25px"
        color="#0984e3"
      />
    </div>;
}

  if (error) {
    return <div>Error! {error.message}</div>;
  }

  const { classes } = props;

  return (
    <div className="team-settings-page">
        <div className="add-user">
          <form onSubmit={handleAddMemberSubmit}>
            <h2>Find a new team member</h2>
            {allUsersQuery.loading &&
              <Loader
              type="ThreeDots"
              height="25px"
              width="25px"
              color="#0984e3"
            />
            }
            {optionsItems && (
                <>
                <TextField
                  className={classes.findMember}
                  label="Search all users"
                  helperText="Find your next great team member"
                  margin="normal"
                  variant="outlined"
                  value={searchInput}
                  onChange={handleSearchChange}
                />
              <div className="all-members">
                {errorMsg && (
                  <div className="error-flash">
                    <h3>{errorMsg.split(":")[1]}</h3>
                    <div className="premium-or-cancel">
                      <StripePaymentPopup teamId={props.teamId} />
                      <Button onClick={() => setErrorMsg("")}>Cancel</Button>
                    </div>
                  </div>
                )}
                {allUsersQuery.data.users && searchInput &&
                  allUsersQuery.data.users.map(user => {
                    if (user.name.toLowerCase().includes(searchInput.toLowerCase())) {
                      return <AddNewMember 
                                user={user}
                                key={user.id} 
                                newMemberId={newMemberId}
                                setNewMemberId={setNewMemberId} 
                                setNewMember={setNewMember}
                                addUserToTeam={addUserToTeam} 
                              />
                    }
                  })
                }
              </div>
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
