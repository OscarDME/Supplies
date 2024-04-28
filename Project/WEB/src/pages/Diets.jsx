import React, { useState } from 'react';
import { AuthenticatedTemplate } from "@azure/msal-react";
import SideDataDisplay from "../components/SideDataDisplay";
import AssignDiets from "../components/AssignDiets/AssignDiets";
import "../styles/Assign.css";
import "../styles/workarea.css";

export const Diets = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <>
        <div className="workarea">
            <AuthenticatedTemplate>
                <SideDataDisplay setSelectedUser={setSelectedUser}/>
                <AssignDiets selectedUser={selectedUser}/>
            </AuthenticatedTemplate>
        </div>
        </>
    )
}