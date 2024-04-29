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
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';

export const NavigationBar = () => {
  const { instance, inProgress } = useMsal();
  const [visible, setVisible] = useState(false);
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
            <NavLink id="Products" to="/Products" className="NavLinks">
              Productos
            </NavLink>
          </div>
          <div className="Navbar-Profile">  
          <div className="justify-content-center">
          <Sidebar position="right" visible={visible} onHide={() => setVisible(false)}>
              <h2>Carrito</h2>
              <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
          </Sidebar>
              <Button icon="pi pi-shopping-cart" onClick={() => setVisible(true)} />
          </div>
              <Button as="button" onClick={handleLogoutRedirect}>
                Cerrar sesion
            </Button>
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
