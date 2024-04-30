import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { useEffect } from 'react';
import { config } from "../utils/conf";
import { useMsal } from "@azure/msal-react";
import { Container } from "react-bootstrap";
import { InteractionStatus } from "@azure/msal-browser"; 
import { loginRequest, b2cPolicies } from '../authConfig';

/***
 * Component to detail ID token claims with a description for each claim. For more details on ID token claims, please check the following links:
 * ID token Claims: https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token
 * Optional Claims:  https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-optional-claims#v10-and-v20-optional-claims-set
 */
export const Home = () => {
    
    
    const { instance } = useMsal();    
    const activeAccount = instance.getActiveAccount();
    const ID_Usuario = activeAccount.idTokenClaims?.oid;

    
    useEffect(() => {
        // Llamada a la API para verificar e insertar el usuario en la base de datos
        if (activeAccount) {
            fetch(`${config.apiBaseUrl}/verifyAndInsertUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ID_Usuario: ID_Usuario,
                    Nombre_Usuario: activeAccount.name
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Respuesta del servidor:", data);
            })
            .catch(error => {
                console.error('Error al verificar o insertar el usuario:', error);
            });
        }
    }, [activeAccount]);
    

    return (
        <>
            <AuthenticatedTemplate>
                { 
                    activeAccount ?
                    <div>¡Bienvenido {activeAccount.name}!</div>
                    :
                    null
                }
            </AuthenticatedTemplate>
        </>
    )
}