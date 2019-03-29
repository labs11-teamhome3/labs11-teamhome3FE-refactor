import React from "react";

const Todos = props => {
  return (
    <div>
      <input type="checkbox" />
      <p>{props.todo.description}</p>
    </div>
  );
};

export default Todos;
