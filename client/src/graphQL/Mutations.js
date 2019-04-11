import gql from 'graphql-tag';

export const CREATE_EVENT = gql`
mutation CREATE_EVENT($userId: ID, $teamId: ID!, $action_string: String!, $object_string: String!) {
  addEvent(userId: $userId, teamId: $teamId, action_string: $action_string, object_string: $object_string) {
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
`

export const CREATE_DOCUMENT = gql`
  mutation CREATE_DOCUMENT(
    $doc_url: String!
    $teamId: ID!
    $userId: ID!
    $title: String!
    $textContent: String!
  ) {
    addDocument(
      doc_url: $doc_url
      teamId: $teamId
      userId: $userId
      title: $title
      textContent: $textContent
    ) {
      id 
      doc_url
      title 
      user {
        id
        name
      }
      team {
        id
      }
      textContent
      folder {
          id
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

export const ADD_DOCUMENT_FOLDER = gql`
mutation ADD_DOCUMENT_FOLDER($folderId: ID!, $documentId: ID!) {
  addDocumentToFolder(folderId: $folderId, documentId: $documentId) {
    id 
    doc_url
    title 
    user {
      id
      name
    }
    team {
      id
    }
    textContent
    folder {
        id
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

export const CREATE_FOLDER = gql`
mutation CREATE_FOLDER(
  $teamId: ID!
  $userId: ID!
  $title: String!
) {
  createFolder(
    teamId: $teamId
    userId: $userId
    title: $title
  ) {
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