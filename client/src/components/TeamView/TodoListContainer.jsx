import React, { useState } from 'react';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

////Components////
import TodoList from './TodoList';
import TeamSettingsModal from './TeamSettingsModal';
import TodoListModal from './TodoListModal';
import CreateTodoList from './CreateTodoList';

////Queries////
import { TODOS_QUERY } from '../../graphQL/Queries';

const TodoListContainer = props => {
  const { data, error, loading } = useQuery(TODOS_QUERY, {
    variables: { id: props.match.params.id },
  });
  console.log(data);
  const [createTodo, setCreateTodo] = useState(false)
  

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  // const todoLists = data.todoLists.filter(todoList => {
  //   console.log(todoList.inTeam.id);
  //   console.log(props.match.params.id);
  //   return todoList.inTeam.id === Number(props.match.params.id);
  // });

  return (
    <div>
      {data.todoLists.map(todoList => (
        <TodoList
          todoList={todoList}
          key={todoList.id}
     
        />
          
      
      ))}
      <Fab onClick={() => setCreateTodo(true)} color="primary" aria-label="Add">
        <AddIcon />
      </Fab>
      <CreateTodoList open={createTodo} setCreateTodo={setCreateTodo} teamId={props.match.params.id} /> 
      <TeamSettingsModal
        teamID={props.match.params.id}
        history={props.history}
      />
    </div>
  );
};

export default TodoListContainer;
