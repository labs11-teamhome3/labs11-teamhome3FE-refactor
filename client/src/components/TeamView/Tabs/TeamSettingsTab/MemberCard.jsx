import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import gql from "graphql-tag";

//// css ///
import './css/TeamSettings.css'
import { useMutation } from "../../../../graphQL/useMutation";

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
        onCompleted: () => console.log('done with removal'),
        onError: err => console.log(err)
    })

    return (
        <div className="member-card">
            <h3>{props.member.name}</h3>
            {props.member.id !== localStorage.getItem('userId') &&
                <Button variant="contained" color="secondary" onClick={removeMember}>Remove Team Member</Button>
            }
        </div>
    )
}

export default MemberCard;