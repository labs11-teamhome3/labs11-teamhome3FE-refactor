import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useMutation } from "../../graphQL/useMutation";

////Components////
import TeamCard from "./TeamCard";

////Queries////
import { TEAMS_QUERY } from "../../graphQL/Queries";

const CREATE_TEAM = gql`
  mutation createTeam($teamName: String!) {
    createTeam(teamName: $teamName) {
      id
      teamName
    }
  }
`;

const TeamList = () => {
  const { data, error, loading } = useQuery(TEAMS_QUERY);
  const [teamInput, setTeamInput] = useState("");
  const [createTeamName] = useMutation(CREATE_TEAM, {
    update: (cache, { data }) => {
      const { teams } = cache.readQuery({ query: TEAMS_QUERY });
      cache.writeQuery({
        query: TEAMS_QUERY,
        data: { teams: [...teams, data.createTeam] }
      });
    },
    variables: { teamName: teamInput },
    onCompleted: e => {
      setTeamInput("");
    },
    onError: err => console.log(err)
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    // <Query query={TEAMS_QUERY}>
    //   {({ loading, error, data }) => {
    //     if (loading) {
    //       return <div>Loading...</div>;
    //     }

    //     if (error) {
    //       return <div>Error! {error.message}</div>;
    //     }
    // return (
    <>
      {data.teams.map(team => (
        <TeamCard team={team} key={team.id} />
      ))}
      <form onSubmit={createTeamName}>
        <input
          type="text"
          value={teamInput}
          onChange={e => setTeamInput(e.target.value)}
        />
        <Fab onClick={createTeamName} color="primary" aria-label="Add">
          <AddIcon />
        </Fab>
      </form>
    </>
  );
  //   }}
  // </Query>
  // );
};

export default TeamList;
