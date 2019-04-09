import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useMutation } from "../../../../graphQL/useMutation";

/////Components/////
import Document from "./Document";
import CreateDocumentModal from "./CreateDocumentModal";
import ViewDocumentModal from "./ViewDocumentModal";
import EditDocumentModal from "./EditDocumentModal";

/////Queries/////
import { CREATE_EVENT } from '../../../../graphQL/Mutations';
import { DOCUMENTS_QUERY } from '../../../../graphQL/Queries';


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
            documentId: documentId
          });
          break;
  
        case "create":
          setCreateModalStatus(!createModalStatus);
          break;
  
        case "edit":
          setEditModalStatus({
            status: !editModalStatus.status,
            documentId: documentId
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
        <CreateDocumentModal
        modalStatus={createModalStatus}
        toggleModal={toggleModal}
        teamId={props.teamId}
        setMsg={props.setMsg}
        />
        {editModalStatus ? (
          <EditDocumentModal
            modalStatus={editModalStatus.status}
            documentId={editModalStatus.documentId}
            toggleModal={toggleModal}
            setMsg={props.setMsg}
          />
        ) : null}
        {viewModalStatus.status ? (
          <ViewDocumentModal
            modalStatus={viewModalStatus.status}
            documentId={viewModalStatus.documentId}
            toggleModal={toggleModal}
            teamId={props.teamId}
            setMsg={props.setMsg}
          />
        ) : null} 
        </div>
    );
  };
  
  export default DocumentTab;