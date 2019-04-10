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

export const ADD_DOCUMENT_FOLDER = gql`
mutation ADD_DOCUMENT_FOLDER($folderId: ID!, $documentId: ID!) {
  addDocumentToFolder(folderId: $folderId, documentId: $documentId) {
    id
    doc_url
    folder {
      id
    }
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
`
