import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import { DropTarget } from "react-dnd";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FolderIcon from "@material-ui/icons/Folder";
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import moment from 'moment';

import { useMutation } from "../../../../graphQL/useMutation";
import {ADD_DOCUMENT_FOLDER} from '../../../../graphQL/Mutations';
import {DOCUMENTS_QUERY} from '../../../../graphQL/Queries';

const styles = theme => ({
  root: {
    marginBottom: "10px"
  }
});

const Folder = props => {
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
  })

  useEffect(() => {
    addDocumentToFolder()
  }, [props.droppedItem])

  const { classes, isOver, canDrop, connectDropTarget, droppedItem } = props;
  return (
    <TableRow 
      ref={instance => connectDropTarget(ReactDOM.findDOMNode(instance))} 
    >
      <TableCell><FolderIcon/> {props.folder.title}</TableCell>
      <TableCell>{moment(props.folder.createdAt).calendar()}</TableCell>
      <TableCell>{props.folder.user.name}</TableCell>
      <TableCell>{props.folder.documents.length}</TableCell>
      <TableCell onClick={_ => props.toggleModal('viewFolder', props.folder.id)}><MoreHoriz/></TableCell>
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