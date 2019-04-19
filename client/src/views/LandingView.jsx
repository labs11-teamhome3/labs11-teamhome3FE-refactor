import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import NavigationView from './NavigationView';

const StyledContainer = styled.div`
  background-color: white;
  // border: solid green 2px;
  height: 1100px;
`;

// Card Styles
const StyledDiv = styled.div`
  display: flex;
  justify-content: space-around;
  border: solid yellow 2px;
  background-color:  #005b9f;
  margin-top: 50px;
  width: 100%;
  h3 {
    border: solid red 2px;
  }
`;

// Top Text
const TopContentText = styled.div`{
  margin-top: 5%;
    h1 {
      display: flex;
      flex-direction: row;
      font-size: 2.5rem;
      color: #005b9f;
      font-weight: 900px;
    }
    p {
      font-size: 1.5rem;
    }

}`;

// Image and Text
const StyledDiv2 = styled.div`
  display: flex;
  justify-content: space-around;
   img {
      width: 500px;
      height: 500px;
    }
`;

// components //

const styles = {
  card: {
    width: '500px',
    height: '350px',
    margin: '0 auto',
    // backgroundColor: 'gold',
    // border: 'solid yellow 2px',
    // background: 'linear-gradient(45deg, #005b9f, gray);',
    background: '#005b9f',
    background: 'white',
    boxShadow:
      '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);',
  },
};

const LandingView = props => {
  useEffect(() => {
    if (localStorage.getItem('userId')) {
      props.history.push();
    }
  });

  const { classes } = props;

  return (
    <StyledContainer>
      <NavigationView auth={props.auth} />

      <StyledDiv2>

        <TopContentText>
          <Typography component="h1"> Connect. </Typography>
          <Typography component="h1"> Conduct. </Typography>
          <Typography component="h1"> Collaborate. </Typography>
          <Typography component="p">No more missed conversations. </Typography>
          <Typography component="p">No more missed opportunities. </Typography>
        </TopContentText>

        <img
          className="nt-image"
          src="https://www.netcenter.net/sites/default/files/collaboration_inforgraphic.png"
          alt="collaboration"
        />

      </StyledDiv2>

      <StyledDiv>
        <Card className={classes.card}>
          <CardContent>
            <div>
              <Typography component="h2">Ease of use</Typography>
            </div>
            <div>
              <Typography component="p">
                Manaje is out of the box and ready to use. Right now.{' '}
              </Typography>
              <Typography component="p">
                With native iOS integration, Manaje allows for total team
                integration, from mobile to desktop.
              </Typography>
            </div>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent>
            <div>
              <Typography component="h2">Simplicity</Typography>
            </div>
            <div>
              <Typography component="p">
                Manaje distills out the noise and keeps the information load
                light.
              </Typography>
              <Typography component="p">
                Concentrate on what really matters: getting your team ready to
                ship world class product.
              </Typography>
            </div>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent>
            <div>
              <Typography component="h2">Adaptability</Typography>
            </div>
            <div>
              <Typography component="p">
                Manaje can incorporate a wide range workplace environments.{' '}
              </Typography>
              <Typography component="p">
                Collegues half-way across the world? Not to worry, our help
                staff are here for you, 24/7.
              </Typography>
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
