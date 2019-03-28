import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import { useMutation } from '../../graphQL/useMutation';
import { useQuery } from 'react-apollo-hooks';

////Queries////
import { TODOS_QUERY } from '../../graphQL/Queries';

const TODO_QUERY = gql`
  query TODO_QUERY($id: ID!) {
    todoList(id: $id) {
      id
      description
      ownedBy {
        id
        name
      }
      assignedTo {
        id
        name
      }
      todos {
        id
        description
        completed
      }
      completed
    }
  }
`;

const CREATE_TODOLIST = gql`
  mutation CREATE_TODOLIST(
    $description: String!
    $ownedBy: String!
    $assignedTo: String!
    $inTeam: ID
  ) {
    createTodoList(
      description: $description
      ownedBy: $ownedBy
      assignedTo: $assignedTo
      inTeam: $inTeam
    ) {
      id
      description
      todos {
        id
        description
      }
    }
  }
`;

const styles = theme => ({
  paper: {
    'max-width': '800px',
    margin: '0 auto',
  },
});

const TodoListModal = props => {
  console.log(props.editing.id);
  const todoList = useQuery(TODO_QUERY, {
    variables: { id: props.editing.id },
  });
  console.log(todoList);
  const [todoListInfo, setTodoInfo] = useState({
    description: props.editing.isEditing
      ? todoList.data.todoList.description
      : '',
  });
  const [createTodoList] = useMutation(CREATE_TODOLIST, {
    update: (cache, { data }) => {
      const { todoLists } = cache.readQuery({
        query: TODOS_QUERY,
        variables: { id: props.teamId },
      });
      cache.writeQuery({
        query: TODOS_QUERY,
        variables: { id: props.teamId },
        data: { todoLists: [...todoLists, data.createTodoList] },
      });
    },
    variables: {
      description: todoListInfo.description,
      ownedBy: 'cjtrn7r4p00at0845l9f9gj9o',
      assignedTo: 'cjtrn7r4p00at0845l9f9gj9o',
      inTeam: props.teamId,
    },
    onCompleted: e => {
      props.toggleModal();
    },
    onError: err => console.log(err),
  });
  const { classes } = props;

  const handleChange = e => {
    setTodoInfo({
      ...todoListInfo,
      [e.target.name]: e.target.value,
    });
  };
  console.log(props.editing);
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.open}
      >
        <Paper className={classes.paper}>
          <Close onClick={props.toggleModal} />
          <h2>{props.editing.isEditing === true ? 'editing' : ''}</h2>
          <input
            type="text"
            value={todoListInfo.description}
            onChange={handleChange}
            name="description"
          />
          <Button onClick={createTodoList}>Save</Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(TodoListModal);
