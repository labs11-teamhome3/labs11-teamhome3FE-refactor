import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
// import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Elements, StripeProvider } from 'react-stripe-elements';

import CheckoutForm from './CheckoutForm';
import { Typography } from '@material-ui/core';

const Transition = props => {
  //console.log('env', process.env)
  return <Slide direction="up" {...props} />;
};

const StripePaymentPopup = props => {
  const [paymentPopupOpen, setPaymentPopupOpen] = useState(false);

  const handleClickOpen = _ => {
    setPaymentPopupOpen(true);
  };

  const handleClose = _ => {
    setPaymentPopupOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Upgrade
      </Button>
      <Dialog
        open={paymentPopupOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {'Upgrade to premium'}
        </DialogTitle>
        <DialogContent>
          <StripeProvider apiKey='pk_test_pA47YPMiJBpyo8BNJdeTw4Ym00tuSVM3hp'>
            <div className="example">
              <Typography component="h3">Credit Card Information</Typography>
              <Elements>
                <CheckoutForm teamId={props.teamId} />
              </Elements>
            </div>
          </StripeProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StripePaymentPopup;

// THIS VERSION WORKS