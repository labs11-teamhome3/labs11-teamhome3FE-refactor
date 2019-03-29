import React, {useState} from 'react';

import EditTodoList from './EditTodoList';

const TodoList = props => {
	const [ editTodo, setEditTodo ] = useState(false);
	return (
		<div onClick={_ => setEditTodo(true)}>
			<h1>{props.todoList.description}</h1>
			<div>
				{props.todoList.todos.map(todo => <h3 key={todo.id}>{todo.description}</h3>)}
				<EditTodoList id={props.todoList.id} open={editTodo} setEditTodo={setEditTodo} teamId={props.teamId} />
			</div>
		</div>
	);
};

export default TodoList;
