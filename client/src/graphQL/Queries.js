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
      completed
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
      email
      phone
      profilePic
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

export const TODO_LIST_QUERY = gql`
  query TODO_LIST_QUERY($id: ID!) {
    todoList(id: $id) {
      id
      description
      ownedBy {
        id
        name
      }
      assignedTo {
        id
        name
      }
      todos {
        id
        description
        completed
      }
      completed
    }
  }
`

export const DOCUMENTS_QUERY = gql`
query DOCUMENTS_QUERY($teamId: ID!) {
  findDocumentsByTeam(teamId: $teamId) {
    id
    title
    textContent
    user {
        id
    }
    team {
        id
    }
  }
}
`;

export const DOCUMENT_QUERY = gql`
query DOCUMENT_QUERY($id: ID!) {
  findDocument(id: $id) {
    id 
    title 
    textContent
    doc_url
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

export const FOLDERS_QUERY = gql`
query FOLDERS_QUERY($teamId: ID!) {
  findFoldersByTeam(teamId:$teamId) {
    id
      title
      user {
          id
          name
      }
      documents {
          id
          doc_url
          title
          textContent
          tag {
              id
              name
          }
      }
  }
}
`;
