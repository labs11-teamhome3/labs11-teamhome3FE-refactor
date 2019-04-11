import React, { Component } from 'react';
import Form from '../components/ProfileView/UserProfile.jsx';
import NavigationView from './NavigationView'

const ProfileView = props => {
    return (
        <div>
            <NavigationView auth={props.Auth} />
            <h1>User Settings</h1>
            <Form/>
        </div>
    );
};

export default ProfileView;

// Need to add Form Component to change User details
// Render Image 