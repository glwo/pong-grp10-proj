import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export default function ProfilePage() {
    const sessionUser = useSelector(state => state.session.user);
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
                    <li>Name: {sessionUser.first_name} {user.last_name}</li>
                    <li>Email: {sessionUser.email}</li>
                    </>
                    }
                </div>
            </ul>
        </div>
    )
}
