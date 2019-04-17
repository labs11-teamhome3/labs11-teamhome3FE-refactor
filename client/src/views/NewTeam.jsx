import React, {useState } from 'react'
// import TeamList from '../components/DashboardView/TeamList'
import gql from "graphql-tag";
import { useMutation } from '../graphQL/useMutation';
import Fab from "@material-ui/core/Fab";
// import Button from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add";
import TextField from '@material-ui/core/TextField';

// components //
import NavigationView from '../views/NavigationView'

////Queries////
import { TEAMS_QUERY } from "../graphQL/Queries";

/// css ///
import './css/NewTeam.css'

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
          localStorage.setItem("firstTeamId", e.createTeam.id)
          props.history.push(`/teams/${e.createTeam.id}/home`)
        },
        onError: err => {
          console.log(err);
        }
      });

    const createFirstTeam = e => {
      e.preventDefault();
      createTeam();
    }


    return (
        <div>
            <NavigationView auth={props.auth}/>
            <div className="new-team">
              <div className="nt-content">
                <img className="nt-image" src='https://www.netcenter.net/sites/default/files/collaboration_inforgraphic.png' alt="collaboration" />
                <h2>Manaje is all about helping you collaborate with your teams.  Create your first team below and begin manaje-ing.</h2>
              </div>
                <div className="nt-form">
                <form onSubmit={createFirstTeam}>
                    <TextField
                      required
                      type="text"
                      placeholder="My First Team..."
                      value={teamInput}
                      onChange={handleChange}
                    />
                    <Fab type="submit" size="large" color="primary" aria-label="Add">
                        <AddIcon />
                    </Fab>
                </form>
                </div>
            </div>
        </div>
    )
}

export default NewTeam;