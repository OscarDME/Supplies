import React, { useState } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import '../styles/WhiteBoard.css';
import '../styles/MenuButtons.css';
import Recipes from '../components/Food/Recipes/Recipes';
import PrimaryFood from '../components/Food/PrimaryFood/PrimaryFood';
import MenuButtons from '../components/MenuButtons';


export const Food = () => {
    const [activeComponent, setActiveComponent] = useState('Alimentos');

    const handleShowComponent = (component) => {
      setActiveComponent(component);
    };
  
    const renderComponent = () => {
      switch (activeComponent) {
        case 'Recetas':
            return <Recipes />;
        case 'Alimentos':
        default:
          return <PrimaryFood/>;
      }
    };
  
    const customMenuItems = [ 'Alimentos','Recetas'];
  
    return (
      <>
        <AuthenticatedTemplate>
        <div className='Container'>
          <div className='buttoncontainer'>
            <MenuButtons menuItems={customMenuItems} handleShowComponent={handleShowComponent} />
          </div>
          <div className='workarea2'>
          {renderComponent()}
          </div>
        </div>
        </AuthenticatedTemplate>
      </>
    );
}