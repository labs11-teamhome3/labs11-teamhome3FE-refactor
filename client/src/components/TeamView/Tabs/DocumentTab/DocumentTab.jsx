import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useMutation } from "../../../../graphQL/useMutation";

/////Components/////
import Document from "./Document";

/////Queries/////
import { CREATE_EVENT } from '../../../../graphQL/Mutations';

const DOCUMENTS_QUERY = gql`
  query DOCUMENTS_QUERY($teamId: ID!) {
    findDocumentsByTeam(teamId: $teamId) {
      id
      title
      textContent
      user {
        id
        name
      }
    }
  }
`;

const DocumentTab = props => {
    const [createModalStatus, setCreateModalStatus] = useState(false);
    const [editModalStatus, setEditModalStatus] = useState({
      status: false,
      documentId: null
    });
    const [viewModalStatus, setViewModalStatus] = useState({
      status: false,
      documentId: null
    });
    const documents = useQuery(DOCUMENTS_QUERY, {
      variables: { teamId: props.teamId }
    });
  
    const toggleModal = (modal, documentId = null) => {
      switch (modal) {
        case "view":
          setViewModalStatus({
            status: !viewModalStatus.status,
            documentId
          });
          break;
  
        case "create":
          setCreateModalStatus(!createModalStatus);
          break;
  
        case "edit":
          // console.log(documentId);
          setEditModalStatus({
            status: !editModalStatus.status,
            documentId
          });
          break;
      }
    };
    // console.log('################', messages)
    return (
      <div>
        <h1>DocumentTab</h1>
        <div>
          {documents.loading ? (
            <h3>Loading</h3>
          ) : (
            documents.data.findDocumentsByTeam.map(document => (
              <Document
                document={document}
                key={document.id}
                toggleModal={toggleModal}
              />
            ))
          )}
        </div>
        <Fab
          color="primary"
          aria-label="Add"
          onClick={_ => toggleModal("create")}
        >
          <AddIcon />
        </Fab>
      </div>
    );
  };
  
  export default DocumentTab;