import React, { useState } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import '../styles/WhiteBoard.css';
import '../styles/MenuButtons.css';
import CurrrentExercises from '../components/Exercises/CurrentExercises';
import MenuButtons from '../components/MenuButtons';


export const Exercises = () => {
  
    return (
      <>
        <AuthenticatedTemplate>
        <div className='Container'>
          <div className='workarea'>
           <CurrrentExercises/>
          </div>
        </div>
        </AuthenticatedTemplate>
      </>
    );
}