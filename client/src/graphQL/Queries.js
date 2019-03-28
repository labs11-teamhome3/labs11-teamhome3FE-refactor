import gql from "graphql-tag";

export const TEAMS_QUERY = gql`
  {
    teams {
      id
      teamName
      # members {
      #   id
      #   name
      # }
    }
  }
`;