import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import { useMutation } from "../../../../graphQL/useMutation";
import { useQuery } from "react-apollo-hooks";

const styles = theme => ({
  paper: {
    "max-width": "800px",
    margin: "0 auto",
    "text-align": "left",
    padding: "20px"
  },
  messageInput: {
    width: "100%",
    marginBottom: "10px"
  }
});

// const CREATE_MESSAGE = gql`
//   mutation CREATE_MESSAGE($title: String!, teamId: ID!, userId: ID!, content: String!) {
//     createMessage (title: $title, teamId: $teamId, userId: $userId, content: $content) {
//       id
//       title
//       creator {
//         name
//       }
//     }
//   }
// `;

const MessageModal = props => {
  const [messageInfo, setMessageInfo] = useState({
    title: "",
    description: ""
  });

  const handleChange = e => {
    setMessageInfo({
      ...messageInfo,
      [e.target.name]: e.target.value
    });
  };

  // const [createMessage] = useMutation(CREATE_MESSAGE, {
  //   update: (cache, { data }) => {
  //     const data = cache.readQuery({
  //       query: TODOS_QUERY,
  //       variables: { id: teamId }
  //     });
  //   //   cache.writeQuery({
  //   //     query: TODOS_QUERY,
  //   //     variables: { id: teamId },
  //   //     data: { todoLists: [...todoLists, data.createTodoList] }
  //   //   });
  //   // },
  //   // variables: {
  //   //   description: todoListInfo.description,
  //   //   ownedBy: users.loading ? "" : users.data.users[0].id,
  //   //   assignedTo: users.loading ? "" : users.data.users[0].id,
  //   //   inTeam: teamId
  //   // },
  //   // onCompleted: e => {
  //   //   setCreateTodo(false);
  //   // },
  //   onError: err => console.log(err)
  // });

  const { classes } = props;
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.modalStatus}
      >
        <Paper className={classes.paper}>
          <h3>Create Message</h3>
          <Close onClick={_ => props.toggleModal(false)} />
          <br />
          <input
            type="text"
            value={messageInfo.title}
            onChange={handleChange}
            name="title"
            placeholder="Message Title"
            className={classes.messageInput}
          />
          <br />
          <textarea
            name="description"
            onChange={handleChange}
            cols="30"
            rows="10"
            value={messageInfo.description}
            placeholder="Message Content"
            className={classes.messageInput}
          />
          <br />
          <Button>Save</Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(MessageModal);
