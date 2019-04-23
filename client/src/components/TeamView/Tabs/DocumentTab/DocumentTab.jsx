import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
// import Fab from "@material-ui/core/Fab";
// import AddIcon from "@material-ui/icons/Add";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import ArrowUp from '@material-ui/icons/ArrowDropUp';
import Typography from '@material-ui/core/Typography';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

/////Components/////
import Folder from './Folder';
import Document from './Document';
import CreateDocumentModal from './CreateDocumentModal';
import ViewDocumentModal from './ViewDocumentModal';
import EditDocumentModal from './EditDocumentModal';
import CreateFolderModal from './CreateFolderModal';
import ViewFolderModal from './ViewFolderModal';
import { withStyles } from '@material-ui/core/styles';
import Loader from 'react-loader-spinner';

/////Queries/////
import { DOCUMENTS_QUERY, FOLDERS_QUERY } from '../../../../graphQL/Queries';
import { useMutation } from "../../../../graphQL/useMutation";
import {ADD_DOCUMENT_FOLDER, UPDATE_FOLDER} from '../../../../graphQL/Mutations';

const styles = theme => ({
  table: {
    minWidth: '400px',
    width: '100%',
  },
  input: {
    display: 'none',
  },
});

const DocumentTab = props => {
  const [droppedItem, setDroppedItem] = useState('');
  const [sortStatus, setSortStatus] = useState(false);

  // function onDrop(item) {
  //   setDroppedItem(item);
  //   folders.refetch();
  // }

  function newSort() {
    //new to old sort
    //console.log('newSort')
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

    //console.log(folders.data.findFoldersByTeam[0].title)
    //how can I get this to rerender after the sort?
    folders.data.findFoldersByTeam.sort(compare);
    documents.data.findDocumentsByTeam.sort(compare);

    setSortStatus(!sortStatus);
  }

  //Documents
  const [createModalStatus, setCreateModalStatus] = useState(false);
  const [editModalStatus, setEditModalStatus] = useState({
    status: false,
    documentId: null,
  });
  const [viewModalStatus, setViewModalStatus] = useState({
    status: false,
    documentId: null,
  });

  //Folders
  const [createFolderModalStatus, setCreateFolderModalStatus] = useState(false);
  const [viewFolderModalStatus, setViewFolderModalStatus] = useState({
    status: false,
    folderId: null,
  });

  //Queries
  const documents = useQuery(DOCUMENTS_QUERY, {
    variables: { teamId: props.teamId },
  });

  const folders = useQuery(FOLDERS_QUERY, {
    variables: { teamId: props.teamId },
  });

  //Modal handler
  const toggleModal = (modal, id = null) => {
    switch (modal) {
      //Documents
      case 'view':
        setViewModalStatus({
          status: !viewModalStatus.status,
          documentId: id,
        });
        break;

      case 'create':
        setCreateModalStatus(!createModalStatus);
        break;

      case 'edit':
        setEditModalStatus({
          status: !editModalStatus.status,
          documentId: id,
        });
        break;

      //Folders
      case 'viewFolder':
        setViewFolderModalStatus({
          status: !viewFolderModalStatus.status,
          folderId: id,
        });
        break;

      case 'createFolder':
        setCreateFolderModalStatus(!createFolderModalStatus);
        break;
    }
  };

  const [documentId, setDocumentId] = useState('');
  const [folderId, setFolderId] = useState('')

  const [addDocumentToFolder] = useMutation(ADD_DOCUMENT_FOLDER, {
  update: (cache, { data }) => {
    const {findDocumentsByTeam} = cache.readQuery({
      query: DOCUMENTS_QUERY,
      variables: { teamId: props.teamId },
    });
    cache.writeQuery({
      query: DOCUMENTS_QUERY,
      variables: { teamId: props.teamId },
      data: { 
        findDocumentsByTeam: findDocumentsByTeam.map(document => {
          if(document.id === documentId) {
            return data.addDocumentToFolder
          } else {
            return document
          }
        })
        },
    });
    const { findFoldersByTeam } = cache.readQuery({
      query: FOLDERS_QUERY,
      variables: { teamId: props.teamId }
      });
      cache.writeQuery({
      query: FOLDERS_QUERY,
      variables: { teamId: props.teamId },
      data: {
        findFoldersByTeam: findFoldersByTeam.map(folder => {
          if(folder.id === folderId) {
            return {...folder, documents: [...folder.documents, data.addDocumentToFolder]}
          } else {
            return folder
          }
        })
      }
    });
  },
  variables: {
    folderId,
    documentId
  },
  onCompleted: e => {
    props.setMsg('added document to folder')
    setDocumentId('')
    setFolderId('')
  },
  onError: err => console.log(err)
});



  const handleDoc = async (file, id) => {
    if(file === 'f') {
      await setFolderId(id)
    } 
    if(file === 'd') {
      await setDocumentId(id)
    }
    //dropTheDoc()

  }

  const dropTheDoc = () => {
    if(folderId && documentId) {
      addDocumentToFolder()
    } else {
      console.log('not ready')
    }
  }

  useEffect(() => {
    if(folderId && documentId) {
      addDocumentToFolder()
    }
  }, [folderId && documentId])

  const matches = useMediaQuery('(min-width:700px)');

  const {classes} = props; 
  return (
      <div>
        <div>
          <div style={{display:'flex', justifyContent:'start'}}>
            <Button variant="contained" color='primary' style={{marginRight: '17px'}}  onClick={() => toggleModal('create')}>Add File</Button>
            <Button variant="outlined" color='primary'  onClick={() => toggleModal('createFolder')}>Create Folder</Button>
          </div>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Created<ArrowUp onClick={newSort} /></TableCell>
                {matches ? <TableCell>Created By</TableCell> : null}
                {matches ? <TableCell># of Docs or Comments</TableCell> : null}
                <TableCell>More</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {folders.loading ? (
              <Loader
                type="ThreeDots"
                height="25px"
                width="25px"
                color="#0984e3"
              />
            ) : (
              folders.data.findFoldersByTeam.map(folder => (
                <Folder
                  handleDoc={handleDoc}
                  matches={matches}
                  refetch={folders.refetch}
                  refetchDocs={documents.refetch}
                  setDroppedItem={setDroppedItem}
                  droppedItem={droppedItem}
                  setMsg={props.setMsg}
                  //onDrop={onDrop}
                  folder={folder}
                  key={folder.id}
                  toggleModal={toggleModal}
                  teamId={props.teamId}
                />
              ))
            )}
            {!documents.data.findDocumentsByTeam ? (
              <Typography component="h3">Loading Documents...</Typography>
            ) : (
              documents.data.findDocumentsByTeam.filter(document => !document.folder)
              .map(document => (
                <Document
                  handleDoc={handleDoc}
                  matches={matches}
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
