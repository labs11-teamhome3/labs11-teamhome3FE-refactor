import React from "react";
import { useQuery } from "react-apollo-hooks";

import { TODOS_QUERY } from "../../../../graphQL/Queries";

import TodoList from "./TodoList";

const TodoLists = props => {
  const todoLists = useQuery(TODOS_QUERY, {
    variables: {
      teamId: props.teamId
    }
  });

  return (
    <div>
      {todoLists.loading ? (
        <h3>Loading</h3>
      ) : (
        todoLists.data.todoLists.map(todoList => (
          <TodoList
            todoList={todoList}
            key={todoList.id}
            toggleModal={props.toggleModal}
          />
        ))
      )}
    </div>
  );
};

export default TodoLists;
