import React from 'react';
import Form from '../components/ProfileView/UserProfile.jsx';
import NavigationView from './NavigationView'

const ProfileView = props => {
    return (
        <div>
            <NavigationView auth={props.auth} />
            <Form/>
        </div>
    );
};

export default ProfileView;
