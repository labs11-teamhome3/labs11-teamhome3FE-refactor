import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import { useMutation } from '../../../../graphQL/useMutation';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';

import { FOLDERS_QUERY } from '../../../../graphQL/Queries';
import { CREATE_EVENT } from '../../../../graphQL/Mutations';

const styles = theme => ({
  paper: {
    'max-width': '800px',
    margin: '0 auto',
    'text-align': 'left',
    padding: '20px',
  },
  messageInput: {
    width: '100%',
    marginBottom: '10px',
  },
});

const CREATE_FOLDER = gql`
  mutation CREATE_FOLDER(
    $teamId: ID!
    $userId: ID!
    $title: String!
  ) {
    createFolder(
      teamId: $teamId
      userId: $userId
      title: $title
    ) {
        id
        title
        user {
            id
            name
        }
        documents {
            id
            doc_url
            title
            textContent
            tag {
                id
                name
            }
        }
    }
  }
`;

const CreateFolderModal = props => {
    const userId = localStorage.getItem('userId');
    const [title, setTitle] = useState('');

  const handleChange = e => {
    setTitle(e.target.value);
  };

  //const users = useQuery(USERS_QUERY);

  const [createFolder] = useMutation(CREATE_FOLDER, {
    update: (cache, { data }) => {
      // console.log(data.createMessage)
      const { findFoldersByTeam } = cache.readQuery({
        query: FOLDERS_QUERY,
        variables: { teamId: props.teamId },
      });
      cache.writeQuery({
        query: FOLDERS_QUERY,
        variables: { teamId: props.teamId },
        data: { findFoldersByTeam: [...findFoldersByTeam, data.createFolder] },
      });
    },
    variables: {
        title: title,
        userId: userId,
        teamId: props.teamId,
    },
    onCompleted: e => {
      props.setMsg('created a folder');
      props.toggleModal('createFolder');
      setTitle('');
    },
    onError: err => console.log(err),
  });

  const { classes } = props;
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.modalStatus}
      >
        <Paper className={classes.paper}>
          <h3>Create Folder</h3>
          <Close onClick={_ => props.toggleModal('createFolder')} />
          <br />
          <input
            type="text"
            value={title}
            onChange={handleChange}
            name="title"
            placeholder="Message Title"
            className={classes.messageInput}
          />
          <br />
          <Button onClick={createFolder}>Save</Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(CreateFolderModal);