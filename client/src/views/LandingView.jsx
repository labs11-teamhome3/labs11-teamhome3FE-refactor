import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import NavigationView from './NavigationView';
import Paper from '@material-ui/core/Paper';

// Page Wrapper
const StyledContainer = styled.div`
  background-color: white;
  height: 1100px;

  @media(max-width: 920px) {
    height: 800px;
 }
`;

// Image and Text Wrapper
const TopContent = styled.div`
  display: flex;
  justify-content: space-around;
  height: 520px;
  width: 80%;
  margin: 0 auto;
  margin-top: 3%;
   img {
      width: 400px;
      height: 400px;
      margin-top: 3%;

        @media(max-width: 920px) {
          width: 300px;
          height: 250px;
      }

    }

  }
  @media(max-width: 800px) {
    height: 300px;
  }
  @media(max-width: 920px) {
     height: 290px;
  }
`;

// Top Text Wrapper
const TopContentText = styled.div`{
  margin-top: 9%;
  height: 100%;
    h1 {
      display: flex;
      flex-direction: row;
      font-size: 2.5rem;
      font-weight: 900px;
      color: #0093c4
    }
    p {
      text-align: left;
      font-size: 1.5rem;
      span {
        font-size: 3rem;
        color: #263238;
      }
    }
      @media(max-width: 800px) {
        height: 250px;
      }
      @media(max-width: 920px) {
        height: 290px;
        margin-top: 12%;
      }  
}`;

// Cards Wrapper
const CardsDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background-color: #263238;
  align-items: center;
  margin-top: 50px;
  width: 100%;
  height: 480px;
  margin: 0 auto;
    h2 {
      font-size: 2rem;
      margin-bottom: 20px;
      color: #0093c4;
    },
    p {
      text-align: left;
      font-size: 1.1rem;
      padding-bottom: 30px;
    }
    @media(max-width: 800px) {
      flex-direction: row;
      margin-top: 10%;
      height: 1200px;
    }

    @media(max-width: 920px) {
      margin-top: 10%;
      flex-direction: row;
      height: 1200px;
   }
`;


// components 
const styles = {
  card: {
    width: '300px',
    height: '300px',
    margin: '50px 1%',
    background: 'white',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);',
  },
};

const LandingView = props => {

  const { classes } = props;

  return (
    <Paper>
      <StyledContainer>
        <NavigationView auth={props.auth} />
        <TopContent>
          <TopContentText>
            <Typography component="h1"> Connect. </Typography>
            <Typography component="h1"> Conduct. </Typography>
            <Typography component="h1"> Collaborate. </Typography>
            {/* <Typography component="p">Remain up to date. </Typography> */}
            <Typography component="p">No more missed opportunities. </Typography>
          </TopContentText>
          <img
            className="nt-image"
            src="https://www.netcenter.net/sites/default/files/collaboration_inforgraphic.png"
            alt="collaboration"
          />
        </TopContent>

        <CardsDiv>
          <Card className={classes.card}>
            <CardContent>
              <div>
                <Typography component="h2">Ease of use</Typography>
              </div>
              <div>
                <Typography component="p">
                  Manaje is out of the box and ready to use. Right now.
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
                  Colleagues half-way across the world? Not to worry, our help
                  staff are here for you, 24/7.
                </Typography>
              </div>
            </CardContent>
          </Card>

        </CardsDiv>
      </StyledContainer>
    </Paper>
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
