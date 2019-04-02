import gql from 'graphql-tag';

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

export const TODOS_QUERY = gql`
  query TODOS_QUERY($id: ID) {
    todoLists(teamId: $id) {
      id
      description
      todos {
        id
        description
        completed
      }
    }
  }
`;

export const USERS_QUERY = gql`
  {
    users {
      id
      name
    }
  }
`

export const MESSAGES_QUERY = gql`
  query MESSAGES_QUERY($teamId: ID!) {
    messages(teamId: $teamId) {
      id
      title
      creator {
        id
        name
      }
      content
    }
  }
`;

export const MESSAGE_QUERY = gql`
query MESSAGE_QUERY($id: ID!){
	message(id: $id) {
    id
    title
    content
    creator {
      id
      name
    }
    comments {
      id
      content
      user {
        id
        name
      }
      image
      likes {
        id
        name
      }
    }
  }
}
`
