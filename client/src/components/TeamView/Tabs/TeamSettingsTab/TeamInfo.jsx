import React, { useState, useEffect } from "react";
import MemberCard from './MemberCard';

/// css ///
import './css/TeamSettings.css'

const TeamInfo = props => {
    const [teamName, setTeamName] = useState(props.team.teamName)


    return (
        <div className="team-info">
            <h2>
                Team Name: {teamName}
            </h2>
            <h2>Team Members</h2>    
                {props.team.members.map(member => 
                    <MemberCard key={member.id} member={member} match={props.match} userRole={props.userRole} />
                )}
        </div>
    )
}

export default TeamInfo;