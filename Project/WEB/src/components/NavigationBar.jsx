import { Dropdown, DropdownButton, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest, b2cPolicies } from "../authConfig";
import { NavLink, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../assets/Logo.svg";
import "../styles/App.css";
import config from "../utils/conf";

export const NavigationBar = () => {
  const { instance, inProgress } = useMsal();
  const [type, setType] = useState(null);
  let activeAccount;
  const location = useLocation();

  useEffect(() => {
    const links = document.querySelectorAll(".NavLinks");
    links.forEach((link) => {
      const id = link.getAttribute("id");
      const currentPath = location.pathname;
      const isActive = currentPath === `/${id}`;
      link.classList.toggle("active-link", isActive);
    });
  }, [location.pathname]);

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  };

  const handleLogoutRedirect = () => {
    instance.logoutRedirect();
  };

  const handleProfileEdit = () => {
    if (inProgress === InteractionStatus.None) {
      instance.acquireTokenRedirect(b2cPolicies.authorities.editProfile);
    }
  };

  return (
    <>
      <nav className="NavigationBar">
        <NavLink className="navbar-brand" to={"/"} id="/">
          <img
            src={logo}
            alt="Logo"
            height="65"
            className="d-inline-block align-top"
          />
        </NavLink>
        <AuthenticatedTemplate>
          <div className="Navbar-Links">
            <NavLink id="Progress" to="/Progress" className="NavLinks">
              Progreso
            </NavLink>
            <NavLink id="Routines" to="/Routines" className="NavLinks">
              Asignar Rutinas
            </NavLink>
            <NavLink id="MyRoutines" to="/MyRoutines" className="NavLinks">
              Rutinas
            </NavLink>
            <NavLink id="Diets" to="/Diets" className="NavLinks">
              Asignar Dietas
            </NavLink>
            <NavLink id="Clients" to="/Clients" className="NavLinks">
              Clientes
            </NavLink>
            <NavLink id="Exercises" to="/Exercises" className="NavLinks">
              Ejercicios
            </NavLink>
            <NavLink id="Food" to="/Food" className="NavLinks">
              Alimentos y Recetas
            </NavLink>
            <NavLink id="Appointment" to="/Appointment" className="NavLinks">
              Citas
            </NavLink>
            <NavLink id="Requests" to="/Requests" className="NavLinks">
              Solicitudes
            </NavLink>
            <NavLink id="Users" to="/Users" className="NavLinks">
              Usuarios
            </NavLink>
            <NavLink
              id="Food_management"
              to="/Food_management"
              className="NavLinks"
            >
              Gestión de Alimentos
            </NavLink>
            <NavLink
              id="Recipes_management"
              to="/Recipes_management"
              className="NavLinks"
            >
              Gestión de Recetas
            </NavLink>
            <NavLink
              id="Exercises_management"
              to="/Exercises_management"
              className="NavLinks"
            >
              Gestión de Ejercicios
            </NavLink>
          </div>
          <div>
            <DropdownButton
              className="ProfileBtn"
              drop="start"
              title={<i className="bi bi-person-fill h2"></i>}
            >
              <Dropdown.ItemText className="dropdown-item-text-light">
                Mi Perfil
              </Dropdown.ItemText>
              <Dropdown.Item as="button" onClick={handleProfileEdit}>
                Editar Perfil
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as="button" onClick={handleLogoutRedirect}>
                Cerrar sesion:{" "}
                {activeAccount && activeAccount.username
                  ? activeAccount.username
                  : "Unknown"}
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <div>
            <Button
              className="ml-auto cta-button"
              onClick={handleLoginRedirect}
            >
              Iniciar sesión
            </Button>
          </div>
        </UnauthenticatedTemplate>
      </nav>
    </>
  );
};
