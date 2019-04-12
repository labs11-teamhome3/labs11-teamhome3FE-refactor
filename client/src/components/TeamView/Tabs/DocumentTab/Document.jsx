import React from "react";
import { DragSource } from "react-dnd";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    marginBottom: "10px"
  }
});

const Document = props => {
  const { classes, connectDragSource } = props;
  return connectDragSource(
    <div>
      <Paper
        elevation={1}
        onClick={_ => props.toggleModal('view', props.document.id)}
      >
        <Typography variant="h5" component="h3">
          {props.document.title}: {props.document.textContent}
        </Typography>
      </Paper>
    </div>
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