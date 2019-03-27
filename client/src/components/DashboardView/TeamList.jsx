import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';

////Components////
import TeamCard from './TeamCard';

const TEAMS_QUERY = gql`
  {
    teams {
      id
      teamName
      members {
        id
        name
      }
    }
  }
`;

const TeamList = () => {
  const { data, error, loading } = useQuery(TEAMS_QUERY);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }
  console.log(data);
  return (
    <div>
      {data.teams.map(team => (
        <TeamCard team={team} key={team.id} />
      ))}
    </div>
  );
};

export default TeamList;
