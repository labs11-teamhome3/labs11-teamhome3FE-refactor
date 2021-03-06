import gql from 'graphql-tag';

export const AUTHENTICATE_USER = gql`
  mutation AUTHENTICATE_USER(
    $idToken: String!
  ) {
    authenticateUser(
      idToken: $idToken
    ) {
      id
      name
      inTeam {
        id
        teamName
        members {
          id
          name
        }
      }
    }
  }
`;

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
      createdAt
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


export const UPDATE_DOCUMENT = gql`
  mutation UPDATE_DOCUMENT($documentId: ID!, $doc_url: String, $title: String, $textContent: String){
  updateDocument(
    documentId: $documentId
    doc_url: $doc_url
    title: $title
    textContent: $textContent
  ) {
  	  id 
      doc_url
      title 
      createdAt
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

export const DELETE_DOCUMENT = gql`
  mutation DELETE_DOCUMENT($documentId: ID!) {
    deleteDocument(documentId: $documentId) {
      id
    }
  }
`;

export const ADD_DOCUMENT_FOLDER = gql`
mutation ADD_DOCUMENT_FOLDER($folderId: ID!, $documentId: ID!) {
  addDocumentToFolder(folderId: $folderId, documentId: $documentId) {
    id 
    doc_url
    title 
    createdAt
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
      createdAt
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

export const UPDATE_FOLDER = gql`
  mutation UPDATE_FOLDER($folderId: ID!, $title: String){
  updateFolderTitle(
    folderId: $folderId
    title: $title
  ) {
  	id
    title
    createdAt
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

export const DELETE_FOLDER = gql`
  mutation DELETE_FOLDER($folderId: ID!) {
    deleteFolder(folderId: $folderId) {
      id
      title
      createdAt
      documents {
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
  }
`;

export const REMOVE_DOC_FOLDER = gql`
  mutation REMOVE_DOC_FOLDER($folderId: ID! $documentId: ID!) {
    removeDocumentFromFolder(folderId: $folderId, documentId: $documentId) {
      id 
      doc_url
      title 
      createdAt
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

export const DELETE_COMMENT = gql`
  mutation DELETE_COMMENT($documentCommentId: ID!){
    deleteDocumentComment(documentCommentId: $documentCommentId) {
      id
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation ADD_COMMENT(
    $documentId: ID!
    $userId: ID!
    $content: String!
  ) {
    addDocumentComment(
      documentId: $documentId
      userId: $userId
      content: $content
    ) {
      id
      content
      user {
        id
        name
        profilePic
      }
      image
      likes {
        id
        name
      }
      }
    
  }
`;

export const LIKE_COMMENT = gql`
  mutation LIKE_COMMENT($commentId: ID!, $userId: ID!){
    likeDocumentComment(commentId: $commentId, userId: $userId) {
      id
      content
      user {
        id
        name
        profilePic
      }
      image
      likes {
        id
        name
      }
    }
  }
`;

export const UNLIKE_COMMENT = gql`
  mutation LIKE_COMMENT($commentId: ID!, $userId: ID!){
    unlikeDocumentComment(commentId: $commentId, userId: $userId) {
      id
      content
      user {
        id
        name
        profilePic
      }
      image
      likes {
        id
        name
      }
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CREATE_MESSAGE(
    $title: String!
    $teamId: ID!
    $userId: ID!
    $content: String!
  ) {
    createMessage(
      title: $title
      teamId: $teamId
      userId: $userId
      content: $content
    ) {
      id
      createdAt
      content
      likes {
        id
      }
      creator {
        id
        name
        profilePic
      }
      images 
      tag {
        id
        name
      }
      comments {
        id
        likes {
          id
        }
        content
        createdAt
        user {
          id
          name
          profilePic
        }
        image
      }
    }
  }
`;

export const LIKE_MESSAGE = gql`
  mutation LIKE_MESSAGE ($messageId: ID!, $userId: ID!){
    likeMessage(messageId: $messageId, userId: $userId) {
      id
      createdAt
      content
      likes {
        id
      }
      creator {
        id
        name
        profilePic
      }
      images 
      tag {
        id
        name
      }
      comments {
        id
        createdAt
        content
        user {
          id
          name
          profilePic
        }
        message {
          id
        }
        image
        likes {
          id
        }
      }
    }
  }
`;

export const UNLIKE_MESSAGE = gql`
  mutation UNLIKE_MESSAGE ($messageId: ID!, $userId: ID!){
    unlikeMessage(messageId: $messageId, userId: $userId) {
      id
      createdAt
      content
      likes {
        id
      }
      creator {
        id
        name
        profilePic
      }
      images 
      tag {
        id
        name
      }
      comments {
        id
        createdAt
        content
        user {
          id
          name
          profilePic
        }
        message {
          id
        }
        image
        likes {
          id
        }
      }
    }
  }
`;

export const ADD_MESSAGE_COMMENT = gql`
  mutation ADD_MESSAGE_COMMENT ($messageId: ID!, $userId: ID!, $content: String!, $image: String){
    addMessageComment(messageId: $messageId, userId: $userId, content: $content, image: $image) {
      id
      createdAt
      content
      user {
        id
        name
        profilePic
      }
      likes {
        id
      }
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DELETE_MESSAGE(
    $id: ID!
  ) {
    deleteMessage(id: $id) {
      id
    }
  }
`

export const UPDATE_MESSAGE = gql`
  mutation UPDATE_MESSAGE(
    $title: String!
    $messageId: ID!
    $content: String!
  ) {
    updateMessage(
      title: $title
      messageId: $messageId
      content: $content
    ) {
      id
      createdAt
      content
      likes {
        id
      }
      creator {
        id
        name
        profilePic
      }
      images 
      tag {
        id
        name
      }
      comments {
        id
        likes {
          id
        }
        content
        createdAt
        user {
          id
          name
          profilePic
        }
        image
      }
    }
  }
`;

export const LIKE_MESSAGE_COMMENT = gql`
  mutation LIKE_MESSAGE_COMMENT($commentId: ID!, $userId: ID!){
    likeMessageComment(commentId: $commentId, userId: $userId) {
      id
      likes {
        id
      }
      content
      createdAt
      user {
        id
        name
        profilePic
      }
      image
    }
  }
`;

export const UNLIKE_MESSAGE_COMMENT = gql`
  mutation UNLIKE_MESSAGE_COMMENT($commentId: ID!, $userId: ID!){
    unlikeMessageComment(commentId: $commentId, userId: $userId) {
      id
      likes {
        id
      }
      content
      createdAt
      user {
        id
        name
        profilePic
      }
      image
    }
  }
`;