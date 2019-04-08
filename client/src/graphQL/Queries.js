import gql from 'graphql-tag';

const userId = localStorage.getItem('userId');

export const TEAMS_QUERY = gql`
  {
    teamsByUser(userId: "${userId}") {
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
  query TODOS_QUERY($teamId: ID) {
    todoLists(teamId: $teamId) {
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
`;

export const MESSAGES_QUERY = gql`
  query MESSAGES_QUERY($teamId: ID!) {
    messages(teamId: $teamId) {
      id
      title
      creator {
        id
        name
      }
      comments {
        id
      }
    }
  }
`;

export const MESSAGE_QUERY = gql`
  query MESSAGE_QUERY($id: ID!) {
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
`;

export const EVENTS_QUERY = gql`
  query EVENTS_QUERY($teamId: ID!) {
    findEventsByTeam(teamId: $teamId) {
      id
      createdAt
      user {
        id
        name
      }
      action_string
      object_string
    }
  }
`;
