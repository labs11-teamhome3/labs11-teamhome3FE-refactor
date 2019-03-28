import React from 'react';

const TodoList = props => {
  console.log(props.todoList);
  return (
    <div>
      <h1>{props.todoList.description}</h1>
      <div>
        {props.todoList.todos.map(todo => (
          <h3 key={todo.id}>{todo.description}</h3>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
