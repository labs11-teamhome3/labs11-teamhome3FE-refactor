import React from "react";
import ReactDOM from "react-dom";
import { DragSource } from "react-dnd";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

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
      onClick={() => props.toggleModal('view', props.document.id)}
    >
      <TableCell component="th" scope="row">
        {props.document.title}
      </TableCell>
      <TableCell align="right">{props.document.textContent}</TableCell>
      <TableCell align="right">{props.document.user.name}</TableCell>
      <TableCell align="right">{props.document.doc_url}</TableCell>
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