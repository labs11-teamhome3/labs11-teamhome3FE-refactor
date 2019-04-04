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
  mutation createTeam($teamName: String!, $userId: ID!) {
    createTeam(teamName: $teamName, userId: $userId) {
      id
      teamName
    }
  }
`;

const TeamList = () => {
  const userId = localStorage.getItem("userId");
  console.log(userId)

  const { data, error, loading } = useQuery(TEAMS_QUERY, {
    variables: { userId: userId }
  });
  const [teamInput, setTeamInput] = useState("");
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
      {data.teamsByUser.map(team => (
        <TeamCard team={team} key={team.id} />
      ))}
      <form onSubmit={createTeam}>
        <input
          type="text"
          value={teamInput}
          onChange={e => setTeamInput(e.target.value)}
        />
        <Fab onClick={createTeam} color="primary" aria-label="Add">
          <AddIcon />
        </Fab>
      </form>
    </>
    // );
    //   }}
    // </Query>
  );
};

export default TeamList;
