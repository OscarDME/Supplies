import { AuthenticatedTemplate } from "@azure/msal-react";
import SideDataDisplay from "../components/SideDataDisplay";
import "../styles/workarea.css";
import UsersProgress from "../components/Progress/UsersProgress";
import React, { useState } from 'react';
import "../styles/Progress.css"

export const Progress = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    return (
        <>
        <div className="workarea">
            <AuthenticatedTemplate>
                <SideDataDisplay setSelectedUser={setSelectedUser}/>
                <UsersProgress selectedUser={selectedUser}/>
            </AuthenticatedTemplate>
        </div>
        </>
    )
}