import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';

////Components////
import TodoList from './TodoList';
import TeamSettingsModal from './TeamSettingsModal';

const TODOS_QUERY = gql`
  query TODOS_QUERY($id: ID) {
    todoLists(teamId: $id) {
      id
      description
      todos {
        id
        description
      }
    }
  }
`;

const TodoListContainer = props => {
  const { data, error, loading } = useQuery(TODOS_QUERY, {
    variables: { id: props.match.params.id },
  });
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

  console.log(data.todoLists);
  return (
    <div>
      {data.todoLists.map(todoList => (
        <TodoList todoList={todoList} key={todoList.id} />
      ))}
      <TeamSettingsModal teamID={props.match.params.id} history={props.history} />
    </div>
  );
};

export default TodoListContainer;
