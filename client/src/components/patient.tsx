import avatar from '../images/patient.png'
import React, { useEffect, useState } from 'react';
import * as process from 'process';

export type Profile = {
}

export default function Patient() {

    const [userProfile, setUserProfile] = useState<Profile>();

    useEffect(() => {
        const test_url = process.env.TEST_APP_API_URL ? process.env.TEST_APP_API_URL : '';

        // get observation data
        fetch(`${test_url}/api/data/profile`)
            .then(res => {
                return res.json();
            }).then(profileData => {
                console.log(profileData);
                setUserProfile(profileData);
            });
    }, [])

    /* DEVELOPER NOTES:
    * Here we are hard coding the users information for the sake of saving time
    * you would display user information that you have stored in whatever persistence layer/mechanism 
    * your application is using
    */
    return (
        <div>
            <h1>User Information</h1>
            <div className='ds-u-display--flex ds-u-flex-direction--row ds-u-align-items--center'>
                <img src={avatar} alt="Profile avatar" />
                <ul>
                    <li>Emily Botsford</li>
                    <li>{JSON.stringify(userProfile)}</li>
                </ul>
            </div>
        </div>
    );
}
