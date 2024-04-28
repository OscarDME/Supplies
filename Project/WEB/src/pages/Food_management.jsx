import { AuthenticatedTemplate } from "@azure/msal-react";
import React from 'react'
import Food_management_list from '../components/Management/Food_management/Food_management_list';

export const Food_management= () =>{
  return (
    <>
      <div className="workarea">
        <AuthenticatedTemplate>
          <Food_management_list/>
          </AuthenticatedTemplate>
      </div>
    </>
  )
}
