import React from "react";
import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
// import { useQuery } from "react-apollo-hooks";
import { useMutation } from "../../../../graphQL/useMutation";

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
                  members: team.members.filter(member => {
                    if (member.id !== props.member.id) {
                      return member;
                    }
                  })
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

    return (
        <div className="member-card">
            <div className="member-info">
                <img className="team-list-pic" src={props.member.profilePic} alt="profile" />
                <h3>{props.member.name}</h3>
            </div>
            {props.member.id !== localStorage.getItem('userId') && props.userRole === "ADMIN" &&
                <Button variant="contained" color="secondary" onClick={removeMember}>Remove</Button>
            }
        </div>
    )
}

export default MemberCard;