import React from 'react';
import { Link } from 'react-router-dom';

const TeamCard = props => {
  return (
    <Link to={`/teams/${props.team.id}/home`}>
      <div>
        <h3>{props.team.teamName}</h3>
        <h4>test</h4>
      </div>
    </Link>
  );
};

export default TeamCard;
