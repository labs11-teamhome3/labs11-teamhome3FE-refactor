import React, { useState } from "react";
import MemberCard from './MemberCard';
import gql from 'graphql-tag';
import { useMutation } from "../../../../graphQL/useMutation";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/EditOutlined"
import Fab from "@material-ui/core/Fab"
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import TextField from '@material-ui/core/TextField';
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography"
import StripePaymentPopup from "../../../Stripe/StripePaymentPopup";
import { withStyles } from '@material-ui/core/styles'

// components //
import DeleteTeamModal from './DeleteTeamModal';

/// css ///
import './css/TeamSettings.css'

const UPDATE_TEAMNAME = gql`
    mutation UPDATE_TEAMNAME($id: ID!, $teamName: String!) {
        updateTeamName(id: $id, teamName: $teamName) {
            id
            teamName
        }
    }
`

const styles = theme => ({
  deleteBtn: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      color: '#ffffff',
      backgroundColor: theme.palette.error.main
    }
  },
  deleteTeamMsg: {
    color: theme.palette.error.main,
    'text-align': 'left',
    'font-size': '1.3rem',
    'font-weight': 'bold',
    'margin': '50px 0 30px 0',
  },
  deleteInput: {
    width: '100%'
  },
  teamMembers: {
    display: 'flex',
    'justify-content': 'flex-start',
    'margin-top': '29px',
    'padding-left': '1%',
    'font-size': '1.5rem'
    
  }
})

const TeamInfo = props => {
    // console.log('team members', props.team.members)

    const [showInput, setInput] = useState(false);
    const [newTeamName, setNewTeamName] = useState("");

    const handleNameChange = e => {
        setNewTeamName(e.target.value)
    }

    const handleTeamSubmit = e => {
        e.preventDefault();
        updateTeamName();
        setNewTeamName("");
    }

    const handleCancel = () => {
        setInput(false);
        setNewTeamName("");
    }

    const [updateTeamName] = useMutation(UPDATE_TEAMNAME, {
        variables: {
            id: props.team.id,
            teamName: newTeamName
        },
        onCompleted: e => {
           setInput(false);
           props.setMsg(`changed the team name to ${newTeamName}`)
        },
        onError: err => console.log(err)
    })

    const { classes } = props;

    return (
        <div className="team-info">
            <div className="name-info">
                <div className="name-edit">
                  {!showInput && 
                      <Typography component='h2' className="team-name">{props.team.teamName}</Typography>
                  }
                  {!showInput && props.userRole === "ADMIN" &&
                    <EditIcon 
                      onClick={() => setInput(true)} 
                      aria-label="Edit"
                    />
                  }
                  {showInput &&
                    <form onSubmit={handleTeamSubmit}>
                        <TextField
                          required
                          inputProps= {{
                            maxLength: 20
                          }}
                          type="text"
                          placeholder={props.team.teamName}
                          value={newTeamName}
                          onChange={handleNameChange}
                        />
                        <CloseIcon 
                          onClick={handleCancel}
                        />
                    </form>
                  }  
                </div>
                <div className="upgrade-delete">
                  {!props.team.premium && 
                    <StripePaymentPopup teamId={props.team.id} />
                  }
                  {props.userRole === 'ADMIN' &&
                    <Button 
                      className={classes.deleteBtn}
                      variant="outlined"
                      onClick={() => props.setAreYouSure(true)}
                    >
                        Delete Team
                    </Button>
                  }     
                </div>
            </div>
            {props.areYouSure && 
              <DeleteTeamModal 
                deleteInput={props.deleteInput}
                handleDeleteChange={props.handleDeleteChange}
                areYouSure={props.areYouSure}
                setAreYouSure={props.setAreYouSure}
                setDeleteInput={props.setDeleteInput}
                deleteTeam={props.deleteTeam}
                team={props.team}
              />
            }
            <Typography className={classes.teamMembers} component="h2">Team Members</Typography>
            <div className="members">
              {props.team.members.map(member => 
                <MemberCard 
                  key={member.id} 
                  setMsg={props.setMsg} 
                  member={member} 
                  match={props.match} 
                  userRole={props.userRole} 
                />
              )}
            </div>
        </div>
    )
}

export default withStyles(styles)(TeamInfo);