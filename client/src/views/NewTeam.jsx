import React from 'react'
import TeamList from '../components/DashboardView/TeamList'

// components //
import NavigationView from '../views/NavigationView'

const NewTeam = props => {
    return (
        <div>
            <NavigationView auth={props.auth}/>
            <h1>Manage is all about helpting you collaborate with your team.  Create your first team below to get started!</h1>
            <TeamList history={props.history} />
        </div>
    )
}

export default NewTeam;