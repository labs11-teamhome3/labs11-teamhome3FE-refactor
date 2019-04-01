import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { useMutation } from "../../graphQL/useMutation";
import gql from "graphql-tag";

////Queries////
import { TEAMS_QUERY } from "../../graphQL/Queries";

const DELETE_TEAM = gql`
  mutation deleteTeam($id: ID!) {
    deleteTeam(id: $id) {
      id
    }
  }
`;

const TeamSettingsModal = props => {
  const [deleteTeam] = useMutation(DELETE_TEAM, {
    update: (cache, { data }) => {
      const { teams } = cache.readQuery({ query: TEAMS_QUERY });
      cache.writeQuery({
        query: TEAMS_QUERY,
        data: { teams: teams.filter(team => team.id !== data.deleteTeam.id) }
      });
    },
    variables: { id: props.teamID },
    onCompleted: e => {
      props.history.push("/dashboard");
    },
    onError: err => console.log(err)
  });

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={deleteTeam}>
        Delete team
        <DeleteIcon />
      </Button>
    </div>
  );
};

export default TeamSettingsModal;
