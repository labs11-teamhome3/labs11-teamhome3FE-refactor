import React from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import { defaultProps } from 'recompose';
import DeleteIcon from "@material-ui/icons/Delete";

const styles = theme => ({
	paper: {
		'max-width': '800px',
		margin: '0 auto',
	},
});

const TodoListModal = ({ classes, handleChange, handleSubmit, handleDelete, todoListInfo, open, editing, setModal }) => {
	return (
		<div>
			<Modal
				aria-labelledby='simple-modal-title'
				aria-describedby='simple-modal-description'
				open={open}
			>
				<Paper className={classes.paper}>
					<Close onClick={e => {
						e.stopPropagation();
						setModal(false)
						}} />
					<input
						type='text'
						value={todoListInfo.description}
						onChange={handleChange}
						name='description'
					/>
					<Button onClick={handleSubmit}>Save</Button>
					{editing ? <Button variant="contained" color="secondary" onClick={handleDelete}>
        	Delete List
        	<DeleteIcon />
      		</Button> : null}
				</Paper>
			</Modal>
		</div>
	);
};

export default withStyles(styles)(TodoListModal);