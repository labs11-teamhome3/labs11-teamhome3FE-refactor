import React, { useState, useEffect } from "react";
import MemberCard from './MemberCard';
import gql from 'graphql-tag';
import { useMutation } from "../../../../graphQL/useMutation";

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

    const handleChange = e => {
        setNewTeamName(e.target.value)
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
            <h2>
                Team Name: {props.team.teamName}
            </h2>
            <button onClick={() => setInput(true)}>Edit Team Name</button>
            {showInput &&
                <>
                    <input type="text" name="teamName" onChange={handleChange} value={newTeamName} />
                    <button onClick={updateTeamName}>Save</button>
                    <button onClick={() => setInput(false)}>Cancel</button>
                </>
            }
            <h2>Team Members</h2>    
                {props.team.members.map(member => 
                    <MemberCard key={member.id} member={member} match={props.match} userRole={props.userRole} />
                )}
        </div>
    )
}

export default TeamInfo;