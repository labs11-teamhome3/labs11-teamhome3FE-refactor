import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { useMutation } from "../../../../graphQL/useMutation";
import gql from "graphql-tag";

///Components///
import TeamInfo from './TeamInfo';

////Queries////
import { TEAMS_QUERY } from "../../../../graphQL/Queries";
import { useQuery } from "react-apollo-hooks";

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
            members {
                id
                name
                role
                profilePic
            }
        }
    }
`

const CURRENT_USER_QUERY = gql`
    query CURRENT_USER_QUERY($id: ID!) {
        user(id: $id) {
            id
            name
            role
        }
    }
`

const TeamSettingsTab = props => {
    const [deleteInput, setDeleteInput] = useState("")

    const handleChange = e => {
      setDeleteInput(e.target.value)
    }

    const [areYouSure, setAreYouSure] = useState(false)
    // get the current user for conditional rendering of removal buttons based on ADMIN status
    const userQuery = useQuery(CURRENT_USER_QUERY, {
        variables: {
            id: localStorage.getItem('userId')
        },
    })
    console.log('user query', userQuery)
    let userRole = '';
    if (userQuery.data.user) {
        userRole = userQuery.data.user.role
    }

  const { data, error, loading } = useQuery(TEAM_QUERY, {
      variables: { id: props.teamId }
  })
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

  if(loading) {
      return <div>Loading...</div>;
  }

  if (error) {
      return <div>Error! {error.message}</div>
  }

  

  return (
    <div>
      <>
      <div className="team-settings">
        <TeamInfo team={data.team} match={props.match} userRole={userRole} />
      </div>
      {userRole === "ADMIN" &&
        <div className="delete-area">
            <Button variant="contained" color="secondary" onClick={() => setAreYouSure(true)}>
                Delete team
                <DeleteIcon />
            </Button>
        </div>
      }
      {areYouSure && 
        <div>
            <h2>Do you really want to delete this team?  All messages, activities, documents, and todo lists which belong to this team will also be deleted!  There is no coming back from this. If you are sure, please type the name of the team below. 
            </h2>
            <input type="text" name="deleteInput" value={deleteInput} onChange={handleChange} />
            <button onClick={() => setAreYouSure(false)}>Cancel</button>
            {deleteInput === data.team.teamName &&
                <Button variant="contained" color="secondary" onClick={deleteTeam}>
                    I understand the consequences.  Delete this team.
                </Button>
            }
        </div>
      }
      </>
    </div>
  );
};

export default TeamSettingsTab;