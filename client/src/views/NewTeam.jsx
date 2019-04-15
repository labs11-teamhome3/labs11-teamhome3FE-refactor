import React, {useState } from 'react'
// import TeamList from '../components/DashboardView/TeamList'
import gql from "graphql-tag";
import { useMutation } from '../graphQL/useMutation';
import Fab from "@material-ui/core/Fab";
// import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add";

// components //
import NavigationView from '../views/NavigationView'

////Queries////
import { TEAMS_QUERY } from "../graphQL/Queries";

const CREATE_TEAM = gql`
  mutation createTeam($teamName: String!, $userId: ID!) {
    createTeam(teamName: $teamName, userId: $userId) {
      id
      teamName
    }
  }
`;

const NewTeam = props => {
    const userId = localStorage.getItem('userId');
    const [teamInput, setTeamInput] = useState("");

    const handleChange = e => {
        setTeamInput(e.target.value);
    } 

    const [createTeam] = useMutation(CREATE_TEAM, {
        update: (cache, { data }) => {
          const { teamsByUser } = cache.readQuery({
            query: TEAMS_QUERY,
            variables: { userId: userId }
          });
          cache.writeQuery({
            query: TEAMS_QUERY,
            data: { teamsByUser: [...teamsByUser, data.createTeam] }
          });
        },
        variables: { teamName: teamInput, userId: userId },
        onCompleted: (e) => {
          setTeamInput("");
          props.history.push(`/teams/${e.createTeam.id}/home`)
        },
        onError: err => {
          console.log(err);
        }
      });


    return (
        <div>
            <NavigationView auth={props.auth}/>
            <h1>Manage is all about helpting you collaborate with your team.  Create your first team below to get started!</h1>
            <form onSubmit={createTeam}>
                <input 
                    type="text" 
                    placeholder='My First Team' 
                    value={teamInput} 
                    onChange={handleChange}
                />
                <Fab onClick={createTeam} color="primary" aria-label="Add">
                    <AddIcon />
                </Fab>
            </form>
        </div>
    )
}

export default NewTeam;