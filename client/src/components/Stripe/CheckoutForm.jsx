import React, { useState, useEffect } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import Button from "@material-ui/core/Button";
import { useMutation } from "../../graphQL/useMutation";
import gql from "graphql-tag";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {UPGRADE} from '../../graphQL/Mutations'

const CheckoutForm = props => {
  console.log(props);
  const [payToken, setPayToken] = useState(null);
  const [success, setSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  let [upgrade] = useMutation(UPGRADE, {
    variables: {
      teamId: props.teamId,
      source: payToken
    },
    onCompleted: data => {
      // alert("Payment Successfully Processed")
      showSB();
      window.setTimeout(_ => {
        window.location.reload();
      }, 6000)
    },
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

  useEffect(
    _ => {
      if(success) {

      }
    },
    [success]
  )

  const showSB = () => {
    setSnackbar(true);
  }

  const handleClose = (e, reason) => {
    if(reason === 'clickaway') {
      return;
    }
    
    setSnackbar(false)
  }

  return (
    <div className="checkout">
      <CardElement />
      <br />
      <Button variant="contained" color="primary" onClick={submit}>
        Submit Payment
      </Button>
      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={snackbar}
          autoHideDuration={6000}
          onClose={handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
            'variant': 'success'
          }}
          variant="success"
          message={<span id="message-id">Payment Successfully Processed</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
    </div>
  );
};

export default injectStripe(CheckoutForm);
