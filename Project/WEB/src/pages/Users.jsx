import { AuthenticatedTemplate } from "@azure/msal-react";
import "../styles/workarea.css";
import UsersList from "../components/Users/UsersList";

export const Users = () => {

    return (
        <>
        <div className="workarea">
            <AuthenticatedTemplate>
                <UsersList/>
            </AuthenticatedTemplate>
        </div>
        </>
    )
}