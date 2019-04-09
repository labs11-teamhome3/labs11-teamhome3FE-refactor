import React, { Component } from 'react';
import Form from '../components/ProfileView/UserProfile.jsx';

const ProfileView = props => {
    return (
        <div>
            <h1>User Settings</h1>
            <Form/>
        </div>
    );
};

export default ProfileView;

// Need to add Form Component to change User details
// Render Image 