import React, { useEffect, useState } from 'react'
import AssignDietsCreate from './AssignDietsCreate';
import AssignDietsCalendar from './AssignDietsCalendar';
import { useMsal } from "@azure/msal-react";
import { AuthenticatedTemplate } from '@azure/msal-react';




export default function AssignDiets({ selectedUser }) {
  const [createdDiet, setCreatedDiet] = useState(null);
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  

  const handleDietCreation = (diet) => {
    setCreatedDiet(diet);
    console.log(createdDiet);
  };

  return (
    <AuthenticatedTemplate>
      {selectedUser ? (
        <>
          <div className='container-diet'>
            <div className='list-container'>
              <h2 className='MainTitle'>Crear dieta</h2>
              <AssignDietsCreate client={selectedUser} onDietCreate={handleDietCreation} />
            </div>
          </div>
          <div className='container-diet'>
            <AssignDietsCalendar client={selectedUser} createdDiet={createdDiet}/>
          </div>
        </>
      ) : (
        <div className='no-user-container'>
          <div>
            <h3>No hay usuario seleccionado</h3>
          </div>
        </div>
      )}
    </AuthenticatedTemplate>
  )
}
