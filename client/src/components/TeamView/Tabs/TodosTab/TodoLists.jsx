import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { withStyles } from "@material-ui/core/styles";
import Masonry from "react-masonry-component";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";

// Queries //
import { TODOS_QUERY } from "../../../../graphQL/Queries";

// Components //
import TodoList from "./TodoList";
import Todo from "./Todo";

const masonryOptions = {
  transitionDuration: 0
};

const styles = theme => ({
  flexcont: {
    display: "flex",
    flexWrap: "wrap",
  },
  drawerCont: {
    padding: "40px"
  },
  todoList: {
    maxHeight: "251px",
    overflow: "auto"
  },
  drawerTitleCont: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
  }
});

const TodoLists = props => {
  const { classes } = props;
  // const [drawerStatus, setDrawerStatus] = useState(false);
  // const [todoList, setTodoList] = useState(null);
  // const [completeTodos, setCompleteTodos] = useState(0);
  const todoLists = useQuery(TODOS_QUERY, {
    variables: {
      teamId: props.teamId
    }
  });

  // useEffect(
  //   _ => {
  //     if (todoList) {
  //       setCompleteTodos(todoList.todos.filter(todo => todo.completed).length);
  //     }
  //   },
  //   [todoList]
  // );

  // const openDrawer = todoListFocus => {
  //   console.log("open");
  //   setDrawerStatus(true);
  //   if (todoListFocus) {
  //     setTodoList(todoListFocus);
  //   }
  //   console.log(drawerStatus);
  // };

  // const closeDrawer = _ => {
  //   setTodoList(null);
  //   setDrawerStatus(false);
  // };



  return (
    <>
    <div className={classes.flexcont}>
      {!todoLists.data.todoLists ? (
        <h3>Loading</h3>
      ) : (
        todoLists.data.todoLists.map(todoList => (
          <TodoList
            todoList={todoList}
            toggleModal={props.toggleModal}
            setMsg={props.setMsg}
            openPanel={props.openPanel}
            normalise={props.normalise}
          />
        ))
      )}
      {/* {todoList && ( */}
        {/* <Drawer variant='persistent' anchor="top" open={drawerStatus} onClose={closeDrawer}>
          {todoList !== undefined && todoList !== null && (
            <>
              <LinearProgress
                variant="determinate"
                value={normalise(completeTodos, 0, todoList.todos.length)}
              />
              <div className={classes.drawerCont}>
                <div className={classes.drawerTitleCont}>
                  <Typography variant="h4">{todoList.description}</Typography>
                  <Button
                    color="primary"
                    className={classes.button}
                    onClick={_ => {
                      props.toggleModal("edit", todoList.id);
                      closeDrawer();
                    }}
                  >
                    Edit
                  </Button>
                </div>
                <List className={classes.todoList}>
                  {todoList.todos.map(todo => (
                    <Todo
                      todo={todo}
                      completeTodos={completeTodos}
                      setCompleteTodos={setCompleteTodos}
                    />
                  ))}
                </List>
              </div>
            </>
          )}
        </Drawer> 
      )}*/}
    </div>
    </>
  );
};

export default withStyles(styles)(TodoLists);
