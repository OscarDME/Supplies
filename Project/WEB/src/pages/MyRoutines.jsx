import { AuthenticatedTemplate } from "@azure/msal-react";
import React, { useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { Container } from "react-bootstrap";
import '../styles/WhiteBoard.css';
import '../styles/MenuButtons.css';
import MenuButtons from '../components/MenuButtons';
import MyRoutinesList from "../components/Routines/MyRoutinesList";
import AllRoutines from "../components/Routines/AllRoutines";


export const MyRoutines = () => {

    const [activeComponent, setActiveComponent] = useState('Mis Rutinas');

    const handleShowComponent = (component) => {
      setActiveComponent(component);
    };
  
    const renderComponent = () => {
      switch (activeComponent) {
        case 'Mis Rutinas':
            return <MyRoutinesList/>;
        case 'Todas las Rutinas':
            return <AllRoutines/>;
        default:
            return <MyRoutinesList/>;
      }
    };
  
    const customMenuItems = [ 'Mis Rutinas','Todas las Rutinas'];


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