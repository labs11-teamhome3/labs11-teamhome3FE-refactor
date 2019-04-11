import React, {useEffect} from "react";
import { DropTarget } from "react-dnd";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

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
  return connectDropTarget(
    <div>
      <Paper
      elevation={1}
      onClick={_ => props.toggleModal('viewFolder', props.folder.id)}
      >
        <Typography variant="h5" component="h3">
          {props.folder.title}
        </Typography>
      </Paper>
    </div>
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