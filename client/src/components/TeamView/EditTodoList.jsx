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



const TodoListModal = ({id, toggleModa, open, setEditTodo}) => {
  const todoList = useQuery(TODO_QUERY, {
    variables: { id: id },
  });
  const [todoListInfo, setTodoInfo] = useState({
    description: ''
  });
  // const [editTodoList] = useMutation(EDIT_TODOLIST, {
    
  //   variables: {
  //     id: id
  //   },
  //   onCompleted: e => {
      
  //   },
  //   onError: err => console.log(err),
  // });
 

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
			todoListInfo={todoListInfo}
			handleChange={handleChange}
      editing={true}
			open={open}
		/>
  );
};

export default TodoListModal;