import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '../../graphQL/useMutation';
import { useQuery } from 'react-apollo-hooks';

////Queries////
import { TODOS_QUERY } from '../../graphQL/Queries';

////Components////
import TodoModal from './TodoListModal';

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

const DELETE_TODOLIST = gql`
  mutation DELETE_TODOLIST($id: String!) {
    deleteTodoList(id: $id) {
      id
    }
  }
`

const TodoListModal = ({id, toggleModa, open, setEditTodo, teamId}) => {
  const todoList = useQuery(TODO_QUERY, {
    variables: { id: id },
  });
  const [todoListInfo, setTodoInfo] = useState({
    description: ''
  });
  const [deleteTodoList] = useMutation(DELETE_TODOLIST, {
    update: (cache, { data }) => {
      const { todoLists } = cache.readQuery({ query: TODOS_QUERY, variables: {id: teamId} });
      cache.writeQuery({
        query: TODOS_QUERY,
        variables: {id: teamId},
        data: { todoLists: todoLists.filter(todo => todo.id !== data.deleteTodoList.id) }
      });
    },
    variables: {
      id: id
    },
    onCompleted: e => {
      setEditTodo(false);
    },
    onError: err => console.log(err),
  });
 

  const handleChange = e => {
    setTodoInfo({
      ...todoListInfo,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <TodoModal
      setModal={setEditTodo}
			handleSubmit={_ => console.log('placeholder')}
      handleDelete={deleteTodoList}
			todoListInfo={todoListInfo}
			handleChange={handleChange}
      editing={true}
			open={open}
		/>
  );
};

export default TodoListModal;