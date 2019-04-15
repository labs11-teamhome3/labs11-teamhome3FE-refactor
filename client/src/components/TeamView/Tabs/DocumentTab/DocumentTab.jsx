import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Table from "@material-ui/core/Table";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import ArrowUp from '@material-ui/icons/ArrowDropUp';

/////Components/////
import Folder from "./Folder";
import Document from "./Document";
import CreateDocumentModal from "./CreateDocumentModal";
import ViewDocumentModal from "./ViewDocumentModal";
import EditDocumentModal from "./EditDocumentModal";
import CreateFolderModal from "./CreateFolderModal";
import ViewFolderModal from "./ViewFolderModal";
import { withStyles } from '@material-ui/core/styles';

/////Queries/////
import { DOCUMENTS_QUERY, FOLDERS_QUERY } from '../../../../graphQL/Queries';

const styles = theme => ({
  table: {
    minWidth: '400px',
    width: '100%'
  },
  input: {
    display: 'none',
  },
});

const DocumentTab = props => {
    const [droppedItem, setDroppedItem] = useState('');

    function onDrop(item){
      setDroppedItem(item)
      folders.refetch()
    }

    function newSort() {
      //new to old sort
      console.log('newSort')
      function compare(a, b) {
        const createdAtA = a.createdAt.toUpperCase();
        const createdAtB = b.createdAt.toUpperCase();
        
        let comparison = 0;
        if (createdAtA > createdAtB) {
          comparison = 1;
        } else if (createdAtA < createdAtB) {
          comparison = -1;
        }
        return comparison * -1;
      }
      //how can I get this to rerender after the sort?
      folders.data.findFoldersByTeam.sort(compare);
      documents.data.findDocumentsByTeam.sort(compare);
    }

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

    useEffect(() => {
      
    }, [folders.data.findFoldersByTeam])
  
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
          break;

        case "createFolder":
          setCreateFolderModalStatus(!createFolderModalStatus);
          break;

      }
    };
    
    const {classes} = props; 
    return (
      <div>
        <div>
          <div style={{display:'flex', justifyContent:'start'}}>
            <Button variant="outlined" color='primary' style={{marginRight: '17px'}} onClick={() => toggleModal('createFolder')}>Create Folder</Button>
            <Button variant="contained" color='primary'  onClick={() => toggleModal('create')}>Create File</Button>
          </div>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Created<ArrowUp onClick={newSort} /></TableCell>
                <TableCell>Created By</TableCell>
                <TableCell># of Docs or Comments</TableCell>
                <TableCell>More</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {folders.loading ? (
              <h3>Loading Folders...</h3>
            ) : (
              folders.data.findFoldersByTeam.map(folder => (
                <Folder
                  refetch={folders.refetch}
                  setDroppedItem={setDroppedItem}
                  droppedItem={droppedItem}
                  setMsg={props.setMsg}
                  onDrop={onDrop}
                  folder={folder}
                  key={folder.id}
                  toggleModal={toggleModal}
                />
              ))
            )}
            {!documents.data.findDocumentsByTeam ? (
              <h3>Loading Documents...</h3>
            ) : (
              documents.data.findDocumentsByTeam.filter(document => !document.folder)
              .map(document => (
                <Document
                teamId={props.teamId}
                document={document}
                key={document.id}
                toggleModal={toggleModal}
                setMsg={props.setMsg}
                />
              ))   
            )}
            </TableBody>
          </Table>        
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
          {viewFolderModalStatus.status ? (
            <ViewFolderModal
              refetch={documents.refetch}
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
  
  export default DragDropContext(HTML5Backend)(withStyles(styles)(DocumentTab));