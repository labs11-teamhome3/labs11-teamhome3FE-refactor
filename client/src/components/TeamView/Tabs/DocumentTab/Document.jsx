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

const styles = theme => ({
  root: {
    margin: '0 7px -5px 0'
  },
  folderDoc: {
    backgroundColor: '#f0f0f0',
  },
  folderDocCell: {
    margin: '0 7px -5px 0'
  }
});

const Document = props => {

  const { connectDragSource, classes } = props;
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
    connectDragSource: connect.dragSource()
  }
}

const cardSource = {
  beginDrag(props, monitor, component) {
    const document = { id: props.document };
    return document;
  }
}

export default withStyles(styles)(DragSource("SOURCE", cardSource, collect)(Document));