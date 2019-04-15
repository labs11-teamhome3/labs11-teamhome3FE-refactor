import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import { DropTarget } from "react-dnd";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FolderIcon from "@material-ui/icons/Folder";
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';

import MoreMenuFolder from './MoreMenuFolder';

import { useMutation } from "../../../../graphQL/useMutation";
import {ADD_DOCUMENT_FOLDER, UPDATE_FOLDER} from '../../../../graphQL/Mutations';
import {DOCUMENTS_QUERY} from '../../../../graphQL/Queries';

const styles = theme => ({
  root: {
    marginBottom: "10px"
  }
});

const Folder = props => {
  const [titleEditStatus, setTitleEditStatus] = useState(false);
  const [titleHandler, setTitleHandler] = useState(''); 

  const [addDocumentToFolder] = useMutation(ADD_DOCUMENT_FOLDER, {
    update: (cache, { data }) => {
      const {findDocumentsByTeam} = cache.readQuery({
        query: DOCUMENTS_QUERY,
        variables: { teamId: props.teamId },
      });
      cache.writeQuery({
        query: DOCUMENTS_QUERY,
        variables: { teamId: props.teamId },
        data: { findDocumentsByTeam: [...findDocumentsByTeam, data.addDocumentToFolder] },
      });
    },
    variables: {
      folderId: props.folder.id,
      documentId: props.droppedItem.id
    },
    onCompleted: e => {
      props.setMsg('added document to folder')
      props.setDroppedItem('')
    },
    onError: err => console.log(err)
  });

  const [updateFolderTitle] = useMutation(UPDATE_FOLDER, {
    variables: {
      folderId: props.folder.id,
      title: titleHandler
    },
    onCompleted: e => {
      props.setMsg('updated a folder')
      setTitleEditStatus(false)
    },
    onError: err => console.log(err)
  });

  useEffect(() => {
    addDocumentToFolder()
  }, [props.droppedItem]);

  useEffect(() => {
    if(props.folder.title) {
      setTitleHandler(props.folder.title)
    }
  }, []);

  const handleChange = e => {
    setTitleHandler(e.target.value)
  };

  const { classes, isOver, canDrop, connectDropTarget, droppedItem } = props;
  return (
    <TableRow 
      ref={instance => connectDropTarget(ReactDOM.findDOMNode(instance))} 
    >
      <TableCell onClick={titleEditStatus ? null : () => props.toggleModal('viewFolder', props.folder.id)}>
        <FolderIcon/> 
        {titleEditStatus ? 
          <TextField 
            value={titleHandler}
            onChange={handleChange}
            onKeyPress = { e => {
                if(e.key === 'Enter') {
                  updateFolderTitle()
                }
              }
            }
          /> 
          : 
          props.folder.title}
      </TableCell>
      <TableCell>{moment(props.folder.createdAt).calendar()}</TableCell>
      <TableCell>{props.folder.user.name}</TableCell>
      <TableCell>{props.folder.documents ? props.folder.documents.length : 0}</TableCell>
      <TableCell>
        <MoreMenuFolder 
          setTitleEditStatus={setTitleEditStatus}
          titleEditStatus={titleEditStatus}
          refetch={props.refetch}
          refetchDocs={props.refetchDocs}
          teamId={props.teamId}
          folder={props.folder}
          toggleModal={props.toggleModal}
          setMsg={props.setMsg} 
        />
      </TableCell>
    </TableRow>
  );
};

const spec = {
  drop(props, monitor, component) {
    const document = monitor.getItem()
    props.onDrop(document.id)
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop()
  }
}

export default DropTarget("SOURCE", spec, collect)(Folder);