import React, { useState, useEffect } from "react";
import { UserCard } from "../DATA_USER_CARD";
import SearchBar from "../SearchBar";
import "../../styles/Management.css";
import config from "../../utils/conf";

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Cargar usuarios desde la API al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/usertype`); // Ajusta esto a la ruta correcta de tu API
        if (!response.ok) {
          throw new Error("Respuesta de red no fue ok");
        }
        const data = await response.json();
        setUsers(data); // Actualiza el estado con los datos de los usuarios
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (user) => {
    if (expandedRow === user.ID_Usuario) {
      setExpandedRow(null);
      setEditingUser(null);
      setSelectedUser(null); // Deselecciona la fila al hacer clic nuevamente
    } else {
      if (editingUser && editingUser.ID_Usuario === user.ID_Usuario) {
        setEditingUser(null); // Si el formulario de edición está abierto, ciérralo
      }
      setEditingUser(null);
      setExpandedRow(user.ID_Usuario);
      setSelectedUser(user); // Selecciona la fila al hacer clic
    }
  };

  // Asumiendo que `birthday` es una cadena en formato IS


  return (
    <div className="container">
      <div className="search-bar-container">
        <div className="search-bar">
          <div className="addclient">
            <i className="bi bi-search h4"></i>
          </div>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>
      <ul className="cardcontainer">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className={`row ${
              (selectedUser && selectedUser.ID_Usuario === user.ID_Usuario) ||
              (editingUser && editingUser.ID_Usuario === user.ID_Usuario)
                ? "selected"
                : ""
            }`}
          >
            <div
              onClick={() => handleRowClick(user)}
              className={`row_header ${
                (selectedUser && selectedUser.ID_Usuario === user.ID_Usuario) ||
                (editingUser && editingUser.ID_Usuario === user.ID_Usuario)
                  ? "selected"
                  : ""
              }`}
            >
              <div className="UserCard">
                {user.gender === "Mujer" && (
                  <div className="icon">
                    <i class="bi bi-person-standing-dress"></i>
                  </div>
                )}
                {user.gender === "Hombre" && (
                  <div className="icon">
                    <i class="bi bi-person-standing"></i>
                  </div>
                )}
                <div>
                <div className="row_name">{user.nombre + ' ' + user.apellido}</div>
                  <div className="row_description">{user.DescripcionTipo}</div>
                </div>
              </div>
            </div>
            {expandedRow === user.ID_Usuario && (
              <>
                {user.DescripcionTipo.includes("cliente") && (
                  <>
                    <div key="role" className="exercise-info">
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">
                          Email: {user.correo}
                        </div>
                        <div className="exercise-info-row">
                          Nacimiento: {user.fecha_nacimiento.split('T')[0]}
                        </div>
                        <div className="exercise-info-row">
                          Género: {user.sexo}
                        </div>
                      </div>
                      <div className="exercise-info-column">
                        {/* <div className="exercise-info-row">
                          Estatura: {user.height} cm
                        </div> */}
                        {/* <div className="exercise-info-row">
                          Peso: {user.weight} kg
                        </div> */}
                      </div>
                    </div>
                  </>
                )}
                {user.DescripcionTipo.includes("normal") && (
                  <>
                    <div className="exercise-info">
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">
                          Email: {user.correo}
                        </div>
                        <div className="exercise-info-row">
                          Nacimiento: {user.fecha_nacimiento.split('T')[0]}
                        </div>
                        <div className="exercise-info-row">
                          Género: {user.sexo}
                        </div>
                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">
                          Nombre de usuario: {user.nombre_usuario} 
                        </div>
                        {/* <div className="exercise-info-row">
                          Peso: {user.weight} kg
                        </div> */}
                      </div>
                    </div>
                  </>
                )}
                {user.DescripcionTipo.includes("Administrador") && (
                  <>
                    <div className="exercise-info">
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">
                          Email: {user.correo}
                        </div>
                        <div className="exercise-info-row">
                          Nacimiento: {user.fecha_nacimiento.split('T')[0]}
                        </div>
                        <div className="exercise-info-row">
                          Género: {user.sexo}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {(user.DescripcionTipo.includes("Nutricionista") ||
                  user.DescripcionTipo.includes("Entrenador")) && (
                  <>
                    <div className="exercise-info">
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">{}</div>
                        {/*Foto de perfil*/}
                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">
                          Email: {user.correo}
                        </div>
                        <div className="exercise-info-row">
                          Nacimiento: {user.fecha_nacimiento.split('T')[0]}
                        </div>
                        <div className="exercise-info-row">Certificado: {}</div>
                        <div className="exercise-info-row">Experiencia: {}</div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
