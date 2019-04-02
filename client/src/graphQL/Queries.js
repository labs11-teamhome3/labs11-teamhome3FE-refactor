import gql from 'graphql-tag';

export const TEAMS_QUERY = gql`
  {
    teamsByUser(userId: "cjtzyqko70035087318fqivwg") {
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
