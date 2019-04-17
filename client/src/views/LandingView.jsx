import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import styled from 'styled-components'
import NavigationView from './NavigationView';

const StyledDiv = styled.div`{
  display: flex;
  justify-content: space-around;
  // border: solid blue 2px;
  

}`;

// components //


const styles = {
  card: {
    width: '550px',
    height: '200px',
    margin: '0 auto',
    backgroundColor: 'white',
    // border: 'solid yellow 2px',
  },

};

const LandingView = props => {
  useEffect( () => {
   if (localStorage.getItem('userId')) {
     props.history.push()
   }
  })
  // const signup = () => {
  //   props.auth.signup();
  // };

  const { classes } = props;

  return (
    <div>
      <NavigationView auth={props.auth}/>
      <h1>
        Connect. <span>Organize. </span> Collaborate.
      </h1>
      <br />
      <p>
        {' '}
        No more missed conversations. No more missed opportunities. Manaje is
        here.{' '}
      </p>
      <div className="nav-btns">
      </div>
      <p>
        Organizing a team is hard. Every person has their preferred work
        environment and preferred apps. They operate on their own timelines, on
        their own schedules. And they all think about work differently.
      </p>
      <p>
        {' '}
        At Manaje, our aim is to get your team operating from one place, so that
        no member of the team is left behind, while each member gets to operate
        out of the environment they are most comfortable working in.{' '}
      </p>
      <h2>Benefits</h2>
      <StyledDiv>
      <Card className={classes.card}>
        <CardContent>
          <div>
            <h3>Ease of use</h3>
          </div>
          <div>
            <p>Manaje is out of the box and ready to use. Right now. </p>
            <p>
              With native iOS integration, Manaje allows for total team
              integration, from mobile to desktop.
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardContent>
          <div>
            <h3>Simplicity</h3>
          </div>
          <div>
            <p>
              Manaje distills out the noise and keeps the information load
              light.
            </p>
            <p>
              Concentrate on what really matters: getting your team ready to
              ship world class product.
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardContent>
          <div>
            <h3>Adaptability</h3>
          </div>
          <div>
            <p>Manaje can incorporate a wide range workplace environments. </p>
            <p>
              Collegues half-way across the world? Not to worry, our help staff
              are here for you, 24/7.
            </p>
          </div>
        </CardContent>
      </Card>


      </StyledDiv>

      <h2>Integration</h2>
      <p>
        In addition to its own built in tracking, commenting, and messaging
        system, Arq integrates with everything from the Creative Cloud, to
        Dropbox, to Google Docs and more.
      </p>
    </div>
  );
};

export default withStyles(styles)(LandingView);
