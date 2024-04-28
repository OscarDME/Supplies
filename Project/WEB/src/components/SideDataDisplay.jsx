import React, { useState, useEffect } from 'react';
import '../styles/SideDataDisplay.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { UserCard } from './DATA_USER_CARD';
import SearchBar from './SearchBar';
import config from '../utils/conf'


export default function SideDataDisplay(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Efecto para solicitar los datos de los usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Asume que tienes un endpoint '/api/users' para obtener los usuarios
        const response = await fetch (`${config.apiBaseUrl}/users`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setUsers(data); // Actualiza el estado con los usuarios obtenidos
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    // Recuperar el usuario seleccionado previamente desde localStorage
    const storedUser = localStorage.getItem('selectedUser');
    if (storedUser) {
      setSelectedUser(JSON.parse(storedUser));
    }
  }, []);

  // Filtra la lista de usuarios basándote en el término de búsqueda
  const filteredUsers = users.filter(user =>
    user.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (user) => {
    // Actualiza el estado para el usuario seleccionado
    setSelectedUser(user);
    props.setSelectedUser(user);
  };

  // Efecto para guardar la selección del usuario en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('selectedUser', JSON.stringify(selectedUser));
  }, [selectedUser]);

  return (
    <>
      <div className='sidedatadisplay'>
        <h2 className='MainTitle'>Mis clientes</h2>
        <div>
          {/* Muestra la tarjeta del usuario seleccionado */}
          {selectedUser && (
            <>
            <div className='separator'>
            <h4>Cliente Seleccionado</h4>
            <div className={`selected-user-card`}>
            { selectedUser.sexo === "M" && (
              <div  className='icon'><i class="bi bi-person-standing-dress"></i></div>
            )}
            {selectedUser.sexo === "H" &&(
              <div  className='icon'><i class="bi bi-person-standing"></i></div>
            )}
              <div>
                <div className='username'>{selectedUser.nombre_usuario}</div>
                <div className='name'>{selectedUser.nombre}</div>
                <div className='email'>{selectedUser.correo}</div>
              </div>
              </div>
            </div>
            </>
          )}
        </div>
        {/* Agrega la barra de búsqueda y conecta su valor al estado */}
        <div className='search-bar'>
        <div className='addclient'><i class="bi bi-search h4"></i></div>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div>
          Mostrando {filteredUsers.length} clientes
        </div>
        <ul className='SideUsersList'>
          {filteredUsers.map((user, key) => (
            <li
              key={key}
              className={`card ${selectedUser && selectedUser.ID_Usuario === user.ID_Usuario ? 'selected' : ''}`}
              onClick={() => handleUserClick(user)}
            >
            { user.sexo === "M" && (
              <div  className='icon'><i class="bi bi-person-standing-dress"></i></div>
            )}
            {user.sexo === "H" &&(
              <div  className='icon'><i class="bi bi-person-standing"></i></div>
            )}
              <div>
                <div className='username'>{user.nombre_usuario}</div>
                <div className='name'>{user.nombre}</div>
                <div className='email'>{user.correo}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
