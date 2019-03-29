import React from "react";

import { TODOS_QUERY } from "../../graphQL/Queries";

import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";

const AddTodos = props => {
  return (
    <div>
      <Button variant="contained" color="primary">
        <AddIcon />
        Add Task
      </Button>
    </div>
  );
};

export default AddTodos;
