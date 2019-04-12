import React, { useState, useEffect } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import Button from "@material-ui/core/Button";
import { useMutation } from "../../graphQL/useMutation";
import gql from "graphql-tag";

const UPGRADE = gql`
  mutation UPGRADE($teamId: ID!, $source: String!) {
    upgradeToPremium(teamId: $teamId, source: $source) {
      id
    }
  }
`;

const CheckoutForm = props => {
  const [payToken, setPayToken] = useState(null);
  let [upgrade] = useMutation(UPGRADE, {
    variables: {
      teamId: props.teamId,
      source: payToken
    },
    onCompleted: data => alert("Payment Successfully Processed"),
    onError: err => alert(err)
  });
  const submit = async e => {
    let res = await props.stripe.createToken({ name: "Name" });
    //console.log(res.token.id);
    //console.log(props.teamId);
    setPayToken(res.token.id);
  };
  useEffect(
    _ => {
      if (payToken !== null && payToken !== undefined) {
        upgrade();
      }
    },
    [payToken]
  );
  return (
    <div className="checkout">
      <CardElement />
      <br />
      <Button variant="contained" color="primary" onClick={submit}>
        Submit Payment
      </Button>
    </div>
  );
};

export default injectStripe(CheckoutForm);
