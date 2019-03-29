import React, {useState} from 'react';

import EditTodoList from './EditTodoList';
import Todos from './Todos';

const TodoList = props => {
	const [ editTodo, setEditTodo ] = useState(false);
	return (
		<div onClick={_ => setEditTodo(true)}>
			<h1>{props.todoList.description}</h1>
			<div>
				{props.todoList.todos.map(todo => <Todos key={todo.id} todo={todo} />)}
				<EditTodoList id={props.todoList.id} open={editTodo} setEditTodo={setEditTodo} teamId={props.teamId} />
			</div>
		</div>
	);
};

export default TodoList;
