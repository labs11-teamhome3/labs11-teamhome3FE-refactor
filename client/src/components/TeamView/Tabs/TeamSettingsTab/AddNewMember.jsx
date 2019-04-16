import React, { useEffect } from 'react';

// import AddIcon from "@material-ui/icons/Add";
// import Fab from "@material-ui/core/Fab";

const AddNewMember = props => {
    
    useEffect( _ => {
        if (props.newMemberId) {
            props.addUserToTeam()
            
        }
      }, [props.newMemberId])

    const setMember = e => {
        props.setNewMember(e.target.dataset.name)
        props.setNewMemberId(e.target.dataset.id);
    }
    return (
        <div className="add-member-card">
            <div className="add-member-info">
                {props.user.profilePic ?
                    <img className="add-member-pic" src={props.user.profilePic} alt="profile" /> :
                    <img className="add-member-pic" src='https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png' alt='profile' />
                }
                <h3>{props.user.name}</h3> 
            </div>
            <button
                className="add-member-button" 
                data-id={props.user.id} 
                data-name={props.user.name}
                onClick={setMember}
            > Add
            </button>
        </div>
    )
}

export default AddNewMember;