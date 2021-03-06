import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import { useMutation } from '../../graphQL/useMutation';
import Loader from 'react-loader-spinner';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

////Components////
import TeamCard from './TeamCard';
import StripePaymentPopup from '../Stripe/StripePaymentPopup';

////Queries////
import { TEAMS_QUERY, CURRENT_USER_QUERY } from '../../graphQL/Queries';

/////css////
import './TeamList.css';

const styles = theme => ({
  root: {

  },
});

const CREATE_TEAM = gql`
  mutation createTeam($teamName: String!, $userId: ID!) {
    createTeam(teamName: $teamName, userId: $userId) {
      id
      teamName
      members {
        id
        name
      }
    }
  }
`;

const TeamList = props => {
  const userId = localStorage.getItem('userId');
  // console.log('teamList userId', userId);

  const [teamInput, setTeamInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showInput, setShowInput] = useState(false);

  const userQuery = useQuery(CURRENT_USER_QUERY, {
    variables: {
      id: localStorage.getItem('userId'),
    },
  });

  // set the current user to get relevant team info

  // let currentUser;
  // if(userQuery.data.user) {
  //   console.log('team list user', userQuery.data.user)
  //   currentUser = userQuery.data.user
  // }

  const { data, error, loading, refetch } = useQuery(TEAMS_QUERY, {
    variables: { userId: localStorage.getItem('userId') },
    fetchPolicy: 'network-only',
  });

  // console.log('teamsData', data);

  useEffect(() => {
    // console.log('useEffect data', data);
    refetch();
  }, []);

  const [createTeam] = useMutation(CREATE_TEAM, {
    update: (cache, { data }) => {
      const { teamsByUser } = cache.readQuery({
        query: TEAMS_QUERY,
        variables: { userId: localStorage.getItem('userId') },
      });
      cache.writeQuery({
        query: TEAMS_QUERY,
        variables: { userId: userId },
        data: { teamsByUser: [...teamsByUser, data.createTeam] },
      });
    },
    variables: { teamName: teamInput, userId: userId },
    onCompleted: e => {
      setTeamInput('');
      // using this refetch to update MyTeams list without reload.
      // Maybe refactor to do it in the createTeam.update
      userQuery.refetch();
      setShowInput(false);
      props.history.push(`/teams/${e.createTeam.id}/home`);
    },
    onError: err => {
      console.log('createTeam error', err);
      setErrorMsg(err.message);
    },
  });

  const cancelAddTeam = () => {
    setShowInput(false);
    setTeamInput('');
  };

  const cancelPremium = () => {
    setErrorMsg('');
    setTeamInput('');
    setShowInput(false);
  };

  const addTeam = e => {
    e.preventDefault();
    createTeam();
  };

  if (loading) {
    return (
      <div>
        <Loader type="ThreeDots" height="25px" width="25px" color="#0984e3" />
      </div>
    );
  }

  if (error) {
    return <div>Error! {error.message}</div>;
  }

  return (
    <>
      <div className="newTeam">
        {!showInput && (
          <>
            <Typography component="h2">My Teams</Typography>
            <div className="show-add-input">
              <Fab
                onClick={() => setShowInput(true)}
                color="secondary"
                size="small"
                aria-label="Add"
              >
                <AddIcon />
              </Fab>
            </div>
          </>
        )}
        {showInput && (
          <form className="new-team-form" onSubmit={addTeam}>
            <TextField
              className="nt-textfield"
              required
              inputProps={{
                maxLength: 20
              }}
              type="text"
              placeholder="new team name..."
              value={teamInput}
              onChange={e => setTeamInput(e.target.value)}
            />
            <Fab type="submit" color="secondary" size="small" aria-label="Add">
              <AddIcon />
            </Fab>
            <Fab
              onClick={cancelAddTeam}
              color="default"
              size="small"
              aria-label="Cancel"
            >
              <CancelIcon />
            </Fab>
          </form>
        )}
      </div>
      {errorMsg && (
        <div className="error-flash">
          <Typography component="h3">{errorMsg.split(':')[1]}</Typography>
          {/* add onClick to below to open Stripe payment modal */}
          <div className="premium">
            <StripePaymentPopup teamId={props.match.params.id} />
            <Button onClick={cancelPremium}>Cancel</Button>
          </div>
        </div>
      )}
      <Divider />
      {userQuery.data.user &&
        userQuery.data.user.inTeam.map(team => (
          <TeamCard match={props.match} team={team} key={team.id} />
        ))}
    </>
    // );
    //   }}
    // </Query>
  );
};

export default withStyles(styles)(TeamList);
