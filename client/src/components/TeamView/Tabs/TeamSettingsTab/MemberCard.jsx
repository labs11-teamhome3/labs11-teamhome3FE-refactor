import React from "react";
import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
// import { useQuery } from "react-apollo-hooks";
import { useMutation } from "../../../../graphQL/useMutation";
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles'

// components //
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import Fab from '@material-ui/core/Fab'


//// css ///
import './css/TeamSettings.css'

const REMOVE_MEMBER = gql`
    mutation REMOVE_USER_FROM_TEAM($userId: ID!, $teamId: ID!) {
        removeUserFromTeam(userId: $userId, teamId: $teamId) {
            id
        }
    }
`

const TEAM_QUERY = gql`
    query team($id: ID!) {
        team(id: $id) {
            id
            teamName
            members {
                id
                name
                role
            }
        }
    }
`

const styles = theme => ({
    root: {
      width: '300px',
      'margin-top': '10px',
      'margin-left': '10px;'
    },
    trash: {
      cursor: 'pointer',
      color: theme.palette.error.main
    }
})

const MemberCard = props => {
    // mutation to remove a team member from the team.
    const [removeMember] = useMutation(REMOVE_MEMBER, {
        update: (cache, { data }) => {
            const { team } = cache.readQuery({
              query: TEAM_QUERY,
              variables: { id: props.match.params.id }
            });
            cache.writeQuery({
              query: TEAM_QUERY,
              variables: { id: props.match.params.id },
              data: {
                team: {
                  ...team,
                  members: team.members.filter(
                    member => member.id !== props.member.id
                  )
                }
              }
            });
          },
        variables: {
            userId: props.member.id,
            teamId: props.match.params.id
        },
        onCompleted: e => {
            props.setMsg(`removed ${props.member.name} from the team`)
        },
        onError: err => console.log(err)
    })

    const { classes } = props;

    return (
        <Paper className={classes.root}>
            <div className="member-card">
                <div className="member-info">
                    {props.member.profilePic ?
                        <img className="team-list-pic" src={props.member.profilePic} alt="profile" /> :
                        <img className="team-list-pic" src='https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png' alt="profile" /> 
                    }
                    <Typography component="h2">
                        {props.member.name}
                    </Typography>
                </div>
                {props.member.id !== localStorage.getItem('userId') && props.userRole === "ADMIN" &&
                    // <Fab 
                    //     size="small" 
                    //     color="secondary"
                    //     onClick={removeMember}
                    // >
                        <DeleteIcon 
                          className={classes.trash}
                          size="small" 
                          onClick={removeMember}
                        />
                    // </Fab>
                    // <Button 
                    //     variant="contained" 
                    //     color="secondary" 
                    //     onClick={removeMember}
                    // >Remove</Button>
                }
            </div>
        </Paper>
    )
}

export default withStyles(styles)(MemberCard);