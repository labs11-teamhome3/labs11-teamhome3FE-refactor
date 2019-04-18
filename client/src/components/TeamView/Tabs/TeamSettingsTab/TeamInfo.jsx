import React, { useState } from "react";
import MemberCard from './MemberCard';
import gql from 'graphql-tag';
import { useMutation } from "../../../../graphQL/useMutation";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/EditOutlined"
import Fab from "@material-ui/core/Fab"
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from '@material-ui/core/TextField';
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography"
import StripePaymentPopup from "../../../Stripe/StripePaymentPopup";
import { withStyles } from '@material-ui/core/styles'

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
    // 'margin-left': '5%',
  },
  deleteTeamMsg: {
    color: '#f50057',
    'text-align': 'left',
    'font-size': '1.3rem',
    'font-weight': 'bold',
    'margin': '50px 0 30px 0',
  },
  deleteInput: {
    width: '50%'
  },
  teamMembers: {
    display: 'flex',
    'justify-content': 'flex-start',
    'margin-top': '50px',
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
                      <Fab onClick={() => setInput(true)} size="small" variant="extended" color="default" aria-label="Edit">
                          <EditIcon />
                      </Fab>
                  }
                  {showInput &&
                    <form onSubmit={handleTeamSubmit}>
                        <TextField
                          required
                          type="text"
                          placeholder={props.team.teamName}
                          value={newTeamName}
                          onChange={handleNameChange}
                          />
                        <Fab type="submit" color="primary" size="small" aria-label="Add">
                          <AddIcon />
                        </Fab>
                        <Fab onClick={handleCancel} color="secondary" size="small" aria-label="Cancel">
                          <DeleteIcon />
                        </Fab>
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
                      color="secondary"
                      onClick={() => props.setAreYouSure(true)}
                    >
                        Delete Team
                    </Button>
                  }     
                </div>
            </div>
            {props.areYouSure && 
                <>
                    <Typography 
                      component="p"
                      className={classes.deleteTeamMsg}  
                    >
                        Do you really want to delete this team? All messages, activities,
                        documents, and todo lists which belong to this team will also be
                        deleted! There is no coming back from this. If you are sure,
                        please type the name of the team below.
                    </Typography>
                    <div className='delete-input-and-btns'>
                      <TextField
                        className={classes.deleteInput}
                        label="Team Name"
                        margin="normal"
                        variant="outlined"
                        value={props.deleteInput}
                        onChange={props.handleDeleteChange}
                      />
                      <div className="cancel-delete-team">
                        <Button 
                            variant="outlined"
                            onClick={() => {
                                props.setAreYouSure(false);
                                props.setDeleteInput('');
                              } 
                            }
                        >
                        Cancel
                        </Button>
                        {props.deleteInput === props.team.teamName &&
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={props.deleteTeam}
                          >
                          Delete
                          </Button>
                        }
                      </div>
                    </div>
                </>
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