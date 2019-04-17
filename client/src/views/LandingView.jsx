import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import styled from 'styled-components'
import NavigationView from './NavigationView';
import Paper from '@material-ui/core/Paper';

const StyledDiv = styled.div`{
  display: flex;
  justify-content: space-around;
  // border: solid blue 2px;
  background-color: #D3D4E4
  margin-top: 50px;
    p {
      font-size: 1.5rem;
    }
    h3 {
      border: solid red 2px;

    }
}`;

const StyledContainer = styled.div`{
  background-color: #D3D4E4;
  // border: solid green 2px;
  height: 1100px;
}`;

const StyledDiv2 = styled.div`{
  // border: solid green 2px;
  display: flex;
  justify-content: space-around;
  margin: 0 auto
  width: 90%
  margin-top: 35px;
    img {
      width: 500px;
      height: 500px;
    }
    h1 {
      // border: solid blue 2px;
      font-size: 5rem;
      margin-bottom: 20px
    }
    p {
      font-size: 2rem;
    }
}`;

const StyledHeader = styled.h4`{
  font-size: 3rem;
  border: solid yellow 2px;
  margin-top: 5%;
}`

// components //


const styles = {
  card: {
    width: '500px',
    height: '350px',
    margin: '0 auto',
    // backgroundColor: 'gold',
    // border: 'solid yellow 2px',
    background: 'linear-gradient(45deg, #5862DF, #E29E1D);'
  },

};

const LandingView = props => {
  useEffect( () => {
   if (localStorage.getItem('userId')) {
     props.history.push()
   }
  })


  const { classes } = props;

  return (
    <StyledContainer>
      <NavigationView auth={props.auth}/>
      <StyledDiv2>
        <div>
          <h1>
            Connect. <br/>Conduct. <br/> Collaborate.
          </h1>
          <br/> 
          <p>
            No more missed conversations. No more missed opportunities. 
          </p>
        </div>
        <img className="nt-image" src='https://www.netcenter.net/sites/default/files/collaboration_inforgraphic.png' alt="collaboration" />
      </StyledDiv2>
      {/* <StyledHeader>Benefits</StyledHeader> */}
      <StyledDiv>
      <Card className={classes.card}>
        <CardContent>
          <div>
            <h2>Ease of use</h2>
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
            <h2>Simplicity</h2>
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
            <h2>Adaptability</h2>
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
    </StyledContainer>
  );
};

export default withStyles(styles)(LandingView);

/*

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
      <h2>Integration</h2>
      <p>
        In addition to its own built in tracking, commenting, and messaging
        system, Arq integrates with everything from the Creative Cloud, to
        Dropbox, to Google Docs and more.
      </p>

*/