import React, { useState } from "react";
import MemberCard from './MemberCard';
import gql from 'graphql-tag';
import { useMutation } from "../../../../graphQL/useMutation";
// import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/EditOutlined"
import Fab from "@material-ui/core/Fab"

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
        updateTeamName();
        setNewTeamName("");
    }

    const handleCancel = () => {
        setInput(false);
        setNewTeamName("");
    }

    const [updateTeamName] = useMutation(UPDATE_TEAMNAME, {
        variables: {
            id: props.team.id,
            teamName: newTeamName
        },
        onCompleted: e => {
           setInput(false);
           props.setMsg(`changed the team name to ${newTeamName}`)
        },
        onError: err => console.log(err)
    })

    return (
        <div className="team-info">
            <div className="name-info">
                <h2 className="team-name">{props.team.teamName}</h2>
                {!showInput && props.userRole === "ADMIN" &&
                    <Fab size="small" variant="extended" color="default" aria-label="Edit">
                        <EditIcon onClick={() => setInput(true)} />
                    </Fab>
                }
            </div>
            <div className="change-name">
                {showInput &&
                    <form onSubmit={handleTeamSubmit}>
                        <input required type="text" name="teamName" onChange={handleNameChange} value={newTeamName} placeholder="edit team name..." />
                        <button className="save-team" type="submit">Save</button>
                        <button className="cancel-save-team" type="button" onClick={handleCancel}>Cancel</button>
                    </form>
                }
            </div>
            <h2 className="members">MEMBERS</h2>    
                {props.team.members.map(member => 
                    <MemberCard key={member.id} setMsg={props.setMsg} member={member} match={props.match} userRole={props.userRole} />
                )}
        </div>
    )
}

export default TeamInfo;