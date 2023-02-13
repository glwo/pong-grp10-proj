import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import UpdateProfileModal from "./editProfileModal"
import OpenModalButton from "../OpenModalButton";
import { updateProfile, getProfile } from '../../store/profile';
import { getUser, updateUser } from '../../store/session';

export default function ProfilePage() {
    const sessionUser = useSelector(state => state.session.user);
    // const sessionUser = useSelector(state => state.profileReducer.profile);

    const dispatch = useDispatch()

    useEffect(() => {
        // dispatch(getUser(+sessionUser.id))
        dispatch(updateUser(+sessionUser.id))
        .then(dispatch(getUser(+sessionUser.id)))
        // dispatch(getProfile(+sessionUser.id))
    }, [dispatch, sessionUser])

    return (
        <div>
            <h1>
                Profile Page
            </h1>
            <ul className="profilepageul">
                <div>
                {sessionUser &&
                    <>
                    <li>
                        <img id='profilepic' src={sessionUser.img_url} alt="Profile picture could not be found"></img>
                    </li>
                    <li>User: {sessionUser.username}</li>
                    <li>Name: {sessionUser.first_name} {sessionUser.last_name}</li>
                    <li>Email: {sessionUser.email}</li>
                    <li>Biography: {sessionUser.bio}</li>
                    <OpenModalButton
                    className= "updateProfileButton"
                    buttonText="Update Profile"
                    // onItemClick={closeMenu}
                    modalComponent={<UpdateProfileModal />}
                    />
                    </>
                    }
                </div>
            </ul>
        </div>
    )
}
