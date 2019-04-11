import React from "react";
import { useQuery } from "react-apollo-hooks";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { withStyles } from "@material-ui/core/styles";
import Masonry from 'react-masonry-component';

import { TODOS_QUERY } from "../../../../graphQL/Queries";

import TodoList from "./TodoList";

const masonryOptions = {
    transitionDuration: 0
};

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 500,
    height: 450
  },
  gridTile: {
    overflow: "auto"
  },
  flexcont: {
  }
});

const TodoLists = props => {
  const { classes } = props;
  const todoLists = useQuery(TODOS_QUERY, {
    variables: {
      teamId: props.teamId
    }
  });

  return (
    <div className={classes.flexcont}>
                <Masonry
                className={'my-gallery-class'} // default ''
                elementType={'ul'} // default 'div'
                options={masonryOptions} // default {}
                disableImagesLoaded={false} // default false
                updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
            >
      {!todoLists.data.todoLists ? (
        <h3>Loading</h3>
      ) : (
        todoLists.data.todoLists.map(todoList => (
          <TodoList
            todoList={todoList}
            toggleModal={props.toggleModal}
            setMsg={props.setMsg}
          />
        ))
      )}
      </Masonry>
    </div>
  );
};

export default withStyles(styles)(TodoLists);
