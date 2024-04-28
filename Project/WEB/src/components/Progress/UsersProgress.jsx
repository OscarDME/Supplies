import React, { useState, useEffect } from 'react';
import Progress_Excercises from './Progress_Excercises';
import Progress_Body_Measures from './Progress_Body_Measures';
import MenuButtons from '../MenuButtons';
import { AuthenticatedTemplate } from '@azure/msal-react';

export default function UsersProgress({ selectedUser }) {
  const [activeComponent, setActiveComponent] = useState('Medidas Corporales');
  const [userForComponent, setUserForComponent] = useState(selectedUser);

  useEffect(() => {
    setUserForComponent(selectedUser);
  }, [selectedUser]);

  const handleShowComponent = (component) => {
    setActiveComponent(component);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Ejercicios':
        return <Progress_Excercises selectedUser={userForComponent} />;
      case 'Medidas Corporales':
      default:
        return <Progress_Body_Measures selectedUser={userForComponent} />;
    }
  };

  const customMenuItems = ['Medidas Corporales', 'Ejercicios'];

  return (
    <AuthenticatedTemplate>
      <div className='Container'>
        <div className='buttoncontainer'>
          <MenuButtons menuItems={customMenuItems} handleShowComponent={handleShowComponent} />
        </div>
        {userForComponent ? (
            <>
            {renderComponent()}
            </>
          ) : (
            <div className='no-user-container MainContainer'>
              <div>
                <h3>No hay usuario seleccionado</h3>
              </div>
            </div>
          )}
      </div>
    </AuthenticatedTemplate>
  );
}
