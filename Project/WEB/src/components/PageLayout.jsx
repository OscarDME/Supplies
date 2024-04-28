import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { NavigationBar } from "./NavigationBar";
import '../styles/PageLayout.css';

export const PageLayout = (props) => {
    return (
        <>
            <div  className="PageLayout">
            <NavigationBar />
            <UnauthenticatedTemplate>
            <br />
            <h5>
                <center>Por favor inicie sesion para comenzar</center>
                <footer>
                    <center>
                        Footer
                    </center>
                </footer>
            </h5>
            <br />
            </UnauthenticatedTemplate>
                <AuthenticatedTemplate>
                    {props.children}
                </AuthenticatedTemplate>
            </div>
        </>
    );
}
