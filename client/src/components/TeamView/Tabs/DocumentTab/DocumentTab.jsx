import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useMutation } from "../../../../graphQL/useMutation";

/////Components/////
import Folder from "./Folder";
import Document from "./Document";
import CreateDocumentModal from "./CreateDocumentModal";
import ViewDocumentModal from "./ViewDocumentModal";
import EditDocumentModal from "./EditDocumentModal";
import CreateFolderModal from "./CreateFolderModal";
import ViewFolderModal from "./ViewFolderModal";
import EditFolderModal from "./EditFolderModal";

/////Queries/////
import { CREATE_EVENT } from '../../../../graphQL/Mutations';
import { DOCUMENTS_QUERY, FOLDERS_QUERY } from '../../../../graphQL/Queries';

const DocumentTab = props => {
    //Documents
    const [createModalStatus, setCreateModalStatus] = useState(false);
    const [editModalStatus, setEditModalStatus] = useState({
      status: false,
      documentId: null
    });
    const [viewModalStatus, setViewModalStatus] = useState({
      status: false,
      documentId: null
    });

    //Folders
    const [createFolderModalStatus, setCreateFolderModalStatus] = useState(false)
    const [editFolderModalStatus, setEditFolderModalStatus] = useState({
      status: false,
      folderId: null
    });
    const [viewFolderModalStatus, setViewFolderModalStatus] = useState({
      status: false,
      folderId: null
    });


    //Queries
    const documents = useQuery(DOCUMENTS_QUERY, {
      variables: { teamId: props.teamId }
    });
    
    const folders = useQuery(FOLDERS_QUERY, {
      variables: { teamId: props.teamId }
    })
  
    //Modal handler
    const toggleModal = (modal, id = null) => {
      switch (modal) {
        
        //Documents
        case "view":
          setViewModalStatus({
            status: !viewModalStatus.status,
            documentId: id
          });
          break;
  
        case "create":
          setCreateModalStatus(!createModalStatus);
          break;

        case "edit":
          setEditModalStatus({
            status: !editModalStatus.status,
            documentId: id
          });
          break;

        //Folders
        case "viewFolder":
          setViewFolderModalStatus({
            status: !viewFolderModalStatus.status,
            folderId: id
          });
          console.log('folderId', viewFolderModalStatus.folderId)
          break;

        case "createFolder":
          setCreateFolderModalStatus(!createFolderModalStatus);
          break;

        case "editFolder":
          setEditFolderModalStatus({
            status: !editFolderModalStatus.status,
            folderId: id
          });
          break;
      }
    };
    
    return (
      <div>
        <h1>Documents</h1>
        <div>
          {documents.loading ? (
            <h3>Loading Documents...</h3>
          ) : (
            documents.data.findDocumentsByTeam.map(document => (
              <Document
                document={document}
                key={document.id}
                toggleModal={toggleModal}
              />
            ))
          )}

          <Fab
            color="primary"
            aria-label="Add"
            onClick={_ => toggleModal("create")}
          >
            <AddIcon />
          </Fab>

          <h1>Folders</h1>
          {folders.loading ? (
            <h3>Loading Folders...</h3>
          ) : (
            folders.data.findFoldersByTeam.map(folder => (
              <Folder
                folder={folder}
                key={folder.id}
                toggleModal={toggleModal}
              />
            ))
          )}

          <Fab
            color="primary"
            aria-label="Add"
            onClick={_ => toggleModal("createFolder")}
          >
            <AddIcon />
          </Fab>

        </div>
        
        {/* ################# Documents ##################*/}
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


        {/* ################# Folders ################## */}
        <CreateFolderModal
          modalStatus={createFolderModalStatus}
          toggleModal={toggleModal}
          teamId={props.teamId}
          setMsg={props.setMsg}
        />
        {editModalStatus ? (
          <EditFolderModal
            modalStatus={editFolderModalStatus.status}
            folderId={editFolderModalStatus.folderId}
            toggleModal={toggleModal}
            setMsg={props.setMsg}
          />
        ) : null}
        {viewFolderModalStatus.status ? (
          <ViewFolderModal
            modalStatus={viewFolderModalStatus.status}
            folderId={viewFolderModalStatus.folderId}
            toggleModal={toggleModal}
            teamId={props.teamId}
            setMsg={props.setMsg}
          />
        ) : null} 

        </div>
    );
  };
  
  export default DocumentTab;