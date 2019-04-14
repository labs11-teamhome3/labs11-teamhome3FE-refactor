import React from "react";
import ReactDOM from "react-dom";
import { DragSource } from "react-dnd";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import File from '@material-ui/icons/InsertDriveFileOutlined';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import moment from 'moment';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

const Document = props => {
  const { classes, connectDragSource } = props;
  return (
    <TableRow 
      ref={instance => connectDragSource(ReactDOM.findDOMNode(instance))} 
    >
      <TableCell>
        <Tooltip title="Drag to folder" TransitionComponent={Zoom}>
          <File/>
        </Tooltip>
          {props.document.title}
      </TableCell>
      <TableCell>{moment(props.document.createdAt).calendar()}</TableCell>
      <TableCell>{props.document.user.name}</TableCell>
      <TableCell><a style={{textDecoration:"none", color:"inherit"}} href={props.document.doc_url} target='_blank'>{props.document.doc_url}</a></TableCell>
      <TableCell onClick={() => props.toggleModal('view', props.document.id)}><MoreHoriz/></TableCell>
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

export default DragSource("SOURCE", cardSource, collect)(Document);