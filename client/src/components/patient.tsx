import avatar from '../images/patient.png'
import React, { useEffect, useState } from 'react';
import * as process from 'process';
import { Button } from '@cmsgov/design-system';
import axios from 'axios';
import { isUndefined } from 'util';

export type Authorization = {
    displayName: string,
    fhirUser: string
}

export type Profile = {
    user_ncid: string,
    fhirUser: string,
    user_authorizations?: Array<Authorization>
}



export default function Patient() {

    const [userProfile, setUserProfile] = useState<Profile>();
    const [header] = useState('Add your Medicaid data');
    const [settingsState] = useState<SettingsType>({
        useDefaultDataButton: false, // Set to true to use hard coded data
    });


    async function goAuthorize() {
        const test_url = process.env.TEST_APP_API_URL ? process.env.TEST_APP_API_URL : ''
        await axios.get(`${test_url}/api/authorize/authurl`)
        .then(response => {
            return response.data;
        })
        .then(data => {
            window.location.href = data;
        })
        .catch(error => {
            window.location.href = "/";
        });
    }

    useEffect(() => {
        const test_url = process.env.TEST_APP_API_URL ? process.env.TEST_APP_API_URL : '';

        // get profile Data
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
        <div className="ds-u-display-flex">
            <h1>User Information</h1>
            <div className="ds-u-display--flex ds-u-justify-content--between">
            <div className="ds-l-col--5">
                <div className='ds-u-display--flex ds-u-flex-direction--row ds-u-align-items--start'>
                    <img src={avatar} alt="Profile avatar" />
                    <div>
                    <ul>
                        <li>Test User</li>
                        <li>Born 07/18/1978</li>
                        <li>Raleigh, NC</li>
                    </ul>
                    </div>
                </div>

                <div className='ds-u-margin-top--2 ds-l-col--4'>
                    <Button id="auth_btn" variation="solid" onClick={goAuthorize}>Authorize</Button>
                </div>
            </div>
            <div className="ds-l-col--6 bb-c-card ds-u-padding-bottom--2 ds-u-margin-bottom--2">
                <h2>NC Account Profile</h2>
                <ul>
                <li>NCID: {userProfile?.user_ncid}</li>
                    <li>Subscriber ID: {userProfile?.fhirUser}</li>
                    <li>Authorized Representative for:
                    {userProfile?.user_authorizations?.map(authorization => {
                            return (
                                <ul>
                                    <li>
                                        {authorization.displayName}
                                        <ul>
                                            <li>{authorization.fhirUser}</li>
                                        </ul>
                                    </li>
                                </ul>
                            )
                        })}
                    </li>
                </ul>
            </div>
        </div>
        </div>
    );
}
