import { AuthenticatedTemplate } from "@azure/msal-react";
import Exercises_management_list from '../components/Management/Exercises_management/Exercises_management_list';

export const Exercises_management = () => {  
  return (
    <div className="container">
      <AuthenticatedTemplate>
      <Exercises_management_list/>
      </AuthenticatedTemplate>
    </div>
  );
};
