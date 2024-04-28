import React, { useState } from 'react';
import { AuthenticatedTemplate } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { Container } from "react-bootstrap";
import SideDataDisplay from "../components/SideDataDisplay";
import AssignRoutines from "../components/AssignRoutines/AssignRoutines";
import "../styles/Assign.css";


export const Routines = () => {
    const [selectedUser, setSelectedUser] = useState(null);


    return (
        <>
            <div className="workarea">
                <AuthenticatedTemplate>
                <SideDataDisplay setSelectedUser={setSelectedUser}/>
                <AssignRoutines selectedUser={selectedUser}/>
                </AuthenticatedTemplate>
            </div>
        </>
    )
}