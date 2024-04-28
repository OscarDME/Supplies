import { AuthenticatedTemplate } from "@azure/msal-react";
import React from 'react'
import Recipes_management_list from '../components/Management/Recipes_management/Recipes_management_list';

export const Recipes_management = () =>{
  return (
    <>
      <div className="workarea">
        <AuthenticatedTemplate>
          <Recipes_management_list/>
          </AuthenticatedTemplate>
      </div>
    </>
  )
}
