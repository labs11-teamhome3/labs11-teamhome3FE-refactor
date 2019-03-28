import React from 'react';

////Components////
import TodoListContainer from '../components/TeamView/TodoListContainer';

const TeamView = props => {
  return (
    <div>
      <TodoListContainer match={props.match} history={props.history} />
    </div>
  );
};

export default TeamView;
