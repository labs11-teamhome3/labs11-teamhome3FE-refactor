import React, { useState, useEffect } from "react";
import MemberCard from './MemberCard';
import gql from 'graphql-tag';
import { useMutation } from "../../../../graphQL/useMutation";
import Button from "@material-ui/core/Button";

/// css ///
import './css/TeamSettings.css'

const UPDATE_TEAMNAME = gql`
    mutation UPDATE_TEAMNAME($id: ID!, $teamName: String!) {
        updateTeamName(id: $id, teamName: $teamName) {
            id
            teamName
        }
    }
`

const TeamInfo = props => {
    const [showInput, setInput] = useState(false);
    const [newTeamName, setNewTeamName] = useState("");

    const handleNameChange = e => {
        setNewTeamName(e.target.value)
    }

    const handleTeamSubmit = e => {
        e.preventDefault();
    }

    const [updateTeamName] = useMutation(UPDATE_TEAMNAME, {
        variables: {
            id: props.team.id,
            teamName: newTeamName
        },
        onCompleted: e => {
           setInput(false);
        },
        onError: err => console.log(err)
    })

    return (
        <div className="team-info">
            <h2>Team: {props.team.teamName.toUpperCase()}</h2>
            {props.userRole === "ADMIN" &&
                <Button variant="contained" color="primary" onClick={() => setInput(true)}>Edit Team Name</Button>
            }
            {showInput &&
                <form onSubmit={handleTeamSubmit}>
                    <input type="text" name="teamName" onChange={handleNameChange} value={newTeamName} placeholder="New Team Name" />
                    <button onClick={updateTeamName}>Save</button>
                    <button onClick={() => setInput(false)}>Cancel</button>
                </form>
            }
            <h2 className="members">MEMBERS</h2>    
                {props.team.members.map(member => 
                    <MemberCard key={member.id} member={member} match={props.match} userRole={props.userRole} />
                )}
        </div>
    )
}

export default TeamInfo;