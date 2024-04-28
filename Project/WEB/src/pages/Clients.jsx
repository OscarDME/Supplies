import React, {useState} from "react";
import { AuthenticatedTemplate } from "@azure/msal-react";
import "../styles/workarea.css";
import '../styles/MenuButtons.css';
import MenuButtons from '../components/MenuButtons';
import MyClients from "../components/Clients/MyClients";
import AddClient from "../components/Clients/AddClient";
import PendingClients from "../components/Clients/PendingClients";
import PendingToAcceptClients from "../components/Clients/PendingToAcceptClients";

export const Clients = () => {

    const [activeComponent, setActiveComponent] = useState('Mis Clientes');

    const handleShowComponent = (component) => {
      setActiveComponent(component);
    };
  
    const renderComponent = () => {
      switch (activeComponent) {
        case 'Mis Clientes':
            return <MyClients/>;
        case 'Pendientes por que me acepten':
            return <PendingClients/>;
        case 'Pendientes por aceptar':
          return <PendingToAcceptClients/>;
        case 'Agregar':
                return <AddClient/>;
        default:
            return <MyClients/>;
      }
    };

    const customMenuItems = [ 'Mis Clientes','Pendientes por que me acepten',"Pendientes por aceptar",'Agregar'];

    return (
        <>
            <AuthenticatedTemplate>
            <div className='Container'>
            <div className='buttoncontainer'>
              <MenuButtons menuItems={customMenuItems} handleShowComponent={handleShowComponent} />
            </div>
            <div className="workarea2">
            {renderComponent()}
            </div>
          </div>
            </AuthenticatedTemplate>
        </>
    )
}