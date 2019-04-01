import React from "react";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import { useMutation } from "../../../../graphQL/useMutation";

/////Components/////
import Message from './Message';

const MESSAGES_QUERY = gql`
  query MESSAGES_QUERY($teamId: ID!) {
    messages(teamId: $teamId) {
      id
      title
      creator {
        name
      }
    }
  }
`;

const MessageTab = props => {
  const messages = useQuery(MESSAGES_QUERY, {
    variables: { teamId: props.teamId }
  });
  console.log(messages.data);

  return (
    <div>
      <h1>MessageTab</h1>
      <div>
        {messages.loading ? (
          <h3>Loading</h3>
        ) : (
          messages.data.messages.map(message => <Message message={message} key={message.id} />
          )
        )}
      </div>
    </div>
  );
};

export default MessageTab;
