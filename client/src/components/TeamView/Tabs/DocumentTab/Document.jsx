import React from "react";
import ReactDOM from "react-dom";
import { DragSource } from "react-dnd";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import File from '@material-ui/icons/InsertDriveFileOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import moment from 'moment';
import MoreMenu from './MoreMenu';
import { withStyles } from '@material-ui/core/styles';

import { useMutation } from "../../../../graphQL/useMutation";
import {ADD_DOCUMENT_FOLDER, UPDATE_FOLDER} from '../../../../graphQL/Mutations';
import { DOCUMENTS_QUERY } from '../../../../graphQL/Queries';

const styles = theme => ({
  root: {
    margin: '0 7px -5px 0'
  },
  folderDoc: {
    // backgroundColor: '#f0f0f0',
  },
  folderDocCell: {
    margin: '0 17px -5px 0',
    position: 'relative',
    left: '10px'
  }
});

const Document = props => {

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
          if(document.id === props.document.id) {
            return data.addDocumentToFolder
          } else {
            return document
          }
        })
        },
    });
  },
  variables: {
    folderId: props.folderId,
    documentId: props.document.id
  },
  onCompleted: e => {
    props.setMsg('added document to folder')
    //props.setDroppedItem('')
  },
  onError: err => console.log(err)
  });

  const { connectDragSource, isDragging, classes } = props;
  return (
    <TableRow 
      className={props.folderDoc ? classes.folderDoc : null}
      ref={instance => connectDragSource(ReactDOM.findDOMNode(instance))} 
    >
      <TableCell 
        onClick={() => props.toggleModal('view', props.document.id)}
      >
        <Tooltip title="Drag to folder" TransitionComponent={Zoom}>
          <File className={props.folderDoc ? classes.folderDocCell : classes.root}/>
        </Tooltip>
          {props.document.title}
      </TableCell>
      <TableCell>{moment(props.document.createdAt).calendar()}</TableCell>
      {props.matches ? <TableCell>{props.document.user.name}</TableCell> : null}
      {props.matches ? <TableCell>{props.document.comments.length}</TableCell> : null}
      <TableCell>
        <MoreMenu
          setExpandedStatus={props.setExpandedStatus}
          expandedStatus={props.expandedStatus} 
          folderId={props.folderId}
          folderDoc={props.folderDoc}
          teamId={props.teamId}
          document={props.document}
          toggleModal={props.toggleModal}
          setMsg={props.setMsg} 
        />
      </TableCell>
    </TableRow>
  );
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

const cardSource = {
  beginDrag(props, monitor, component) {
    return props.document;
  },
  endDrag(props, monitor, component) {
    if(!monitor.didDrop()) {
      return null; 
    }

    return props.handleDoc('d', props.document.id)
  }
}

export default withStyles(styles)(DragSource("SOURCE", cardSource, collect)(Document));