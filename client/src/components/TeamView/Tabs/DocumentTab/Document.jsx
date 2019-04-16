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

// const styles = theme => ({
//   root: {
//     width: '100%',
//     marginTop: theme.spacing.unit * 3,
//     overflowX: 'auto',
//   },
//   table: {
//     minWidth: 700,
//   },
// });

const Document = props => {
  const { connectDragSource } = props;
  return (
    <TableRow 
      hover={true}
      ref={instance => connectDragSource(ReactDOM.findDOMNode(instance))} 
    >
      <TableCell onClick={() => props.toggleModal('view', props.document.id)}>
        <Tooltip title="Drag to folder" TransitionComponent={Zoom}>
          <File/>
        </Tooltip>
          {props.document.title}
      </TableCell>
      <TableCell>{moment(props.document.createdAt).calendar()}</TableCell>
      <TableCell>{props.document.user.name}</TableCell>
      <TableCell>{props.document.comments.length}</TableCell>
      <TableCell>
        <MoreMenu 
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

export default DragSource("SOURCE", cardSource, collect)(Document);