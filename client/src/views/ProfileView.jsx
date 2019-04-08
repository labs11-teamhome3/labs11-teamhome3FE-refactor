import React, { Component } from 'react';
import UserProfile from '../components/ProfileView/UserProfile.jsx';

const ProfileView = props => {
    return (
        <div>
            <h1>User Settings</h1>
            <UserProfile/>
        </div>
    );
};

export default ProfileView;

// Need to add Form Component to change User details
// Render Image 