import React, { useState } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import '../styles/WhiteBoard.css';
import '../styles/MenuButtons.css';
import CanceledAppointments from '../components/Appointments/CanceledAppointments';
import CurrentAppointments from '../components/Appointments/CurrentAppointments';
import MenuButtons from '../components/MenuButtons';
import AppointmentsHistory from '../components/Appointments/AppointmentsHistory';


export const Appointment = () => {
    const [activeComponent, setActiveComponent] = useState('Citas Actuales');

    const handleShowComponent = (component) => {
      setActiveComponent(component);
    };
  
    const renderComponent = () => {
      switch (activeComponent) {
        case 'Historial de citas':
          return <AppointmentsHistory />;
        case 'Citas canceladas/rechazadas':
            return <CanceledAppointments />;
        case 'Citas Actuales':
        default:
          return <CurrentAppointments/>;
      }
    };
  
    const customMenuItems = ['Citas Actuales', 'Historial de citas','Citas canceladas/rechazadas'];
  
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