import React, { useState } from 'react';
import { AuthenticatedTemplate } from "@azure/msal-react";
import '../styles/WhiteBoard.css';
import '../styles/MenuButtons.css';
import MenuButtons from '../components/MenuButtons';
import RequestExercises from '../components/Requests/RequestExercises/RequestExercises';
import RequestFoods from '../components/Requests/RequestFoods/RequestFoods';
import RequestRecipes from '../components/Requests/RequestRecipes/RequestRecipes';
import RequestTrainersNutricionists from '../components/Requests/RequestTrainersNutricionist/RequestTrainersNutricionists';

export const Requests = () => {
    const [activeComponent, setActiveComponent] = useState('Entrenador/Nutricionista');

    const handleShowComponent = (component) => {
      setActiveComponent(component);
    };
  
    const renderComponent = () => {
      switch (activeComponent) {
        case 'Entrenador/Nutricionista':
            return <RequestTrainersNutricionists/>;
        case 'Ejercicios':
            return <RequestExercises/>;
        case 'Alimentos':
                return <RequestFoods/>;
        case 'Recetas':
                return <RequestRecipes/>;
        default:
            return <RequestTrainersNutricionists/>;
      }
    };
  
    const customMenuItems = [ 'Entrenador/Nutricionista','Ejercicios','Alimentos','Recetas'];

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
      );
}