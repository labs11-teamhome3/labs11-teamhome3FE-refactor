import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { useMutation } from "../../../../graphQL/useMutation";
import gql from "graphql-tag";

///Components///
import TeamInfo from "./TeamInfo";
import StripePaymentPopup from "../../../Stripe/StripePaymentPopup";

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

const TeamSettingsTab = props => {
  const [deleteInput, setDeleteInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [newMember, setNewMember] = useState("");
  const [newMemberId, setNewMemberId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleDeleteChange = e => {
    setDeleteInput(e.target.value);
  };

  const handleSearchChange = e => {
    setSearchInput(e.target.value);
  };

  const handleSelectChange = e => {
    // console.log('e', e.target)
    const members = Array.from(e.target);
    // console.log('members', members);
    const selectedMember = members.find(member => member.selected);
    const selectedMemberId = selectedMember.dataset.id;
    setNewMember(e.target.value);
    setNewMemberId(selectedMemberId);
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
  if (userQuery.data.user) {
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
      props.history.push("/dashboard");
      // reload the window to remove the team.  NEEDS TO BE FIXED
      window.location.reload();
    },
    onError: err => console.log(err)
  });

  // query all users to populate dropdown for adding member to team
  const allUsersQuery = useQuery(USERS_QUERY);
  //   console.log('allUsrsQuery', allUsersQuery);

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
      });
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
  // set up options for the add a member <select> element
  let optionsItems;
  if (allUsersQuery.data.users) {
    optionsItems = allUsersQuery.data.users.map(user => (
      <option className="selected-member" data-id={user.id} key={user.id}>
        {user.name}
      </option>
    ));
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <div>
      <>
        <div className="team-settings">
          <TeamInfo
            team={data.team}
            match={props.match}
            userRole={userRole}
            setMsg={props.setMsg}
          />
        </div>
        <div className="add-user">
          <form onSubmit={handleAddMemberSubmit}>
            <h2>Find a new team member!</h2>
            {optionsItems && (
              <>
                <input
                  type="text"
                  placeholder="search all users"
                  value={searchInput}
                  onChange={handleSearchChange}
                />
                <select value={newMember} onChange={handleSelectChange}>
                  {optionsItems.filter(item =>
                    item.props.children
                      .toLowerCase()
                      .includes(searchInput.toLowerCase())
                  )}
                </select>
                {newMember && (
                  <button
                    onClick={addUserToTeam}
                  >{`Add ${newMember} to the Team!`}</button>
                )}
                {errorMsg && (
                  <div className="error-flash">
                    <h3>{errorMsg.split(":")[1]}</h3>
                    <div className="premium-or-cancel">
                      {/* Need to add stripe integration to button below */}
                      <StripePaymentPopup teamId={props.teamId} />
                      <Button onClick={() => setErrorMsg("")}>Cancel</Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </form>
        </div>
        {userRole === "ADMIN" && !data.team.premium && (
          <div>
            <StripePaymentPopup teamId={props.teamId} />
          </div>
        )}
        {userRole === "ADMIN" && (
          <div className="delete-area">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setAreYouSure(true)}
            >
              Delete team
              <DeleteIcon />
            </Button>
          </div>
        )}
        {areYouSure && (
          <div>
            <h2>
              Do you really want to delete this team? All messages, activities,
              documents, and todo lists which belong to this team will also be
              deleted! There is no coming back from this. If you are sure,
              please type the name of the team below.
            </h2>
            <input
              type="text"
              name="deleteInput"
              value={deleteInput}
              onChange={handleDeleteChange}
            />
            <button onClick={() => setAreYouSure(false)}>Cancel</button>
            {deleteInput === data.team.teamName && (
              <Button
                variant="contained"
                color="secondary"
                onClick={deleteTeam}
              >
                I understand the consequences. Delete this team.
              </Button>
            )}
          </div>
        )}
      </>
    </div>
  );
};

export default TeamSettingsTab;
