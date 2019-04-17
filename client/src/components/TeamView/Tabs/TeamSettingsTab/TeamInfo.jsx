import React, { useState } from "react";
import MemberCard from './MemberCard';
import gql from 'graphql-tag';
import { useMutation } from "../../../../graphQL/useMutation";
// import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/EditOutlined"
import Fab from "@material-ui/core/Fab"
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from '@material-ui/core/TextField';
import AddIcon from "@material-ui/icons/Add";

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
                {!showInput && 
                    <h2 className="team-name">{props.team.teamName}</h2>
                }
                {!showInput && props.userRole === "ADMIN" &&
                    <Fab onClick={() => setInput(true)} size="small" variant="extended" color="default" aria-label="Edit">
                        <EditIcon />
                    </Fab>
                }
            </div>
            <div className="change-name">
                {showInput &&
                  <form onSubmit={handleTeamSubmit}>
                      <TextField
                        required
                        type="text"
                        placeholder={props.team.teamName}
                        value={newTeamName}
                        onChange={handleNameChange}
                      />
                      <Fab type="submit" color="primary" size="small" aria-label="Add">
                        <AddIcon />
                      </Fab>
                      <Fab onClick={handleCancel} color="secondary" size="small" aria-label="Cancel">
                        <DeleteIcon />
                      </Fab>
                  </form>
                }
                {/* {showInput &&
                    <form onSubmit={handleTeamSubmit}>
                        <input required type="text" name="teamName" onChange={handleNameChange} value={newTeamName} placeholder={props.team.teamName} />
                        <button className="save-team" type="submit">Save</button>
                        <button className="cancel-save-team" type="button" onClick={handleCancel}>Cancel</button>
                    </form>
                } */}
            </div>
            <h2 className="members">MEMBERS</h2>    
                {props.team.members.map(member => 
                    <MemberCard 
                        key={member.id} 
                        setMsg={props.setMsg} 
                        member={member} 
                        match={props.match} 
                        userRole={props.userRole} 
                    />
                )}
        </div>
    )
}

export default TeamInfo;