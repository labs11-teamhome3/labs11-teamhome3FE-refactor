import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { useMutation } from "../../../../graphQL/useMutation";
import gql from "graphql-tag";

///Components///
import TeamInfo from './TeamInfo';

////Queries////
import { TEAMS_QUERY } from "../../../../graphQL/Queries";
import { useQuery } from "react-apollo-hooks";

const DELETE_TEAM = gql`
  mutation deleteTeam($id: ID!) {
    deleteTeam(id: $id) {
      id
    }
  }
`;

const TEAM_QUERY = gql`
    query team($id: ID!) {
        team(id: $id) {
            id
            teamName
            members {
                id
                name
                role
            }
        }
    }
`

const TeamSettingsTab = props => {
  const { data, error, loading } = useQuery(TEAM_QUERY, {
      variables: { id: props.teamId }
  })
  console.log("team settings data", data);
  const [deleteTeam] = useMutation(DELETE_TEAM, {
    update: (cache, { data }) => {
      const { teams } = cache.readQuery({ query: TEAMS_QUERY });
      cache.writeQuery({
        query: TEAMS_QUERY,
        data: { teams: teams.filter(team => team.id !== data.deleteTeam.id) }
      });
    },
    variables: { id: props.teamId },
    onCompleted: e => {
      props.history.push("/dashboard");
    },
    onError: err => console.log(err)
  });

  if(loading) {
      return <div>Loading...</div>;
  }

  if (error) {
      return <div>Error! {error.message}</div>
  }

  return (
    <div>
      <>
      <div className="team-settings">
        <TeamInfo team={data.team} match={props.match} />
      </div>
      <Button variant="contained" color="secondary" onClick={deleteTeam}>
        Delete team
        <DeleteIcon />
      </Button>
      </>
    </div>
  );
};

export default TeamSettingsTab;