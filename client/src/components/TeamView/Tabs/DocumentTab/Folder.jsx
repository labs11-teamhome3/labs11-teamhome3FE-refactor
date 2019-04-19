import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import { DropTarget } from "react-dnd";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FolderIcon from "@material-ui/icons/Folder";
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowDown from '@material-ui/icons/ArrowDropDown';

import MoreMenuFolder from './MoreMenuFolder';
import Document from './Document';

import { useMutation } from "../../../../graphQL/useMutation";
import {ADD_DOCUMENT_FOLDER, UPDATE_FOLDER} from '../../../../graphQL/Mutations';
import {DOCUMENTS_QUERY} from '../../../../graphQL/Queries';
import { FormHelperText } from "../../../../../node_modules/@material-ui/core";

const styles = theme => ({
  root: {
    marginBottom: '-5px',
    marginRight: '7px'
  },
  panel: {
    width: '100%'
  },
  arrow: {
    marginBottom: '-5px'
  }
});

const Folder = props => {
  const [titleEditStatus, setTitleEditStatus] = useState(false);
  const [titleHandler, setTitleHandler] = useState(''); 
  const [expandedStatus, setExpandedStatus] = useState(false);

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
            if(document.id === props.droppedItem.id) {
              return data.addDocumentToFolder
            } else {
              return document
            }
          })
         },
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
    <>
      <TableRow 
        hover={true}
        ref={instance => connectDropTarget(ReactDOM.findDOMNode(instance))} 
      >
      {/* onClick={titleEditStatus ? null : () => props.toggleModal('viewFolder', props.folder.id)} */}
        <TableCell
          onClick={() => setExpandedStatus(!expandedStatus)}
        >
          {expandedStatus ? <ArrowDown className={classes.arrow} /> : <ArrowRight className={classes.arrow} />}
          <FolderIcon style={isOver && canDrop ? {fontSize: '50px'} : null} className={classes.root}/> 
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
        {props.matches ? <TableCell>{props.folder.user.name}</TableCell> : null}
        {props.matches ? <TableCell>{props.folder.documents ? props.folder.documents.length : 0}</TableCell> : null}
        <TableCell>
          <MoreMenuFolder 
            setExpandedStatus={setExpandedStatus}
            expandedStatus={expandedStatus}
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
      {props.folder.documents && expandedStatus ? (
        props.folder.documents.map(document => (
            <Document
              setExpandedStatus={setExpandedStatus}
              expandedStatus={expandedStatus}
              matches={props.matches}
              folderId={props.folder.id}
              folderDoc={true}
              teamId={props.teamId}
              className={classes.document}
              teamId={props.teamId}
              document={document}
              key={document.id}
              toggleModal={props.toggleModal}
              setMsg={props.setMsg}
            />
        ))
      ): null}
    </>
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

export default withStyles(styles)(DropTarget("SOURCE", spec, collect)(Folder));