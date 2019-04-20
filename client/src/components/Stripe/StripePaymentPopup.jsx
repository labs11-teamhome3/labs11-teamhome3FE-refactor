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
import { withStyles } from '@material-ui/core/styles';

const Transition = props => {
  //console.log('env', process.env)
  return <Slide direction="up" {...props} />;
};

const styles = theme => ({
  upgradeBtn: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    '&:hover': {
      color: '#ffffff',
      backgroundColor: theme.palette.primary.main
    }
  }
})


const StripePaymentPopup = props => {
  const [paymentPopupOpen, setPaymentPopupOpen] = useState(false);

  const handleClickOpen = _ => {
    setPaymentPopupOpen(true);
  };

  const handleClose = _ => {
    setPaymentPopupOpen(false);
  };

  const { classes } = props;

  return (
    <div>
      <Button variant="outlined" className={classes.upgradeBtn} onClick={handleClickOpen}>
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
          <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
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

export default withStyles(styles)(StripePaymentPopup);

// THIS VERSION WORKS