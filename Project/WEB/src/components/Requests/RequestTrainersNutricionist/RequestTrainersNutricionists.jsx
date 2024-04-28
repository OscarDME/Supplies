import React, { useState, useEffect } from 'react';
import SearchBar from '../../SearchBar';
import '../../../styles/Management.css';
import RequestTrainersNutricionistAdd from './RequestTrainersNutricionistAdd';
import RequestTrainersNutricionistDelete from './RequestTrainersNutricionistDelete';
import config from "../../../utils/conf";

export default function RequestTrainersNutricionists() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [addingUser, setAddingUser] = useState(null);
    const [eliminatingUser, setEliminatingUser] = useState(null);
    const [users, setUsers] = useState([]); // Estado para almacenar los usuarios obtenidos de la API

    // Función para obtener los datos de la API
    const fetchApplicationDetails = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/applicationdetails`);
            if (!response.ok) {
                throw new Error('Respuesta de la API no fue exitosa');
            }
            const data = await response.json();
            setUsers(data); // Actualiza el estado con los datos recibidos
        } catch (error) {
            console.error('Error al obtener los detalles de la solicitud:', error);
        }
    };

    // useEffect para cargar los datos al montar el componente
    useEffect(() => {
        fetchApplicationDetails();
    }, []);

    const handleRowClick = (user) => {
        if (expandedRow === user.ID_Solicitud_WEB) {
            setExpandedRow(null);
            setAddingUser(null);
            setEliminatingUser(null);
            setSelectedUser(null); // Deselecciona la fila al hacer clic nuevamente
        } else {
            if (addingUser && addingUser.ID_Solicitud_WEB === user.ID_Solicitud_WEB) {
                setAddingUser(null);
                setEliminatingUser(null);
            }
            setAddingUser(null);
            setEliminatingUser(null);
            setExpandedRow(user.ID_Solicitud_WEB);
            setSelectedUser(user); // Selecciona la fila al hacer clic
        }
    };

    const handleAddClick = (user) => {
        if (addingUser && addingUser.ID_Solicitud_WEB === user.ID_Solicitud_WEB) {
            setAddingUser(null); // Si el mismo ejercicio está seleccionado, oculta el formulario
        } else {
            if (expandedRow && expandedRow !== user.ID_Solicitud_WEB) {
                setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
                setSelectedUser(null);
                setEliminatingUser(null);
            }
            setExpandedRow(null);
            setSelectedUser(null);
            setEliminatingUser(null);
            setAddingUser(user); // Muestra el formulario de edición para el ejercicio seleccionado
        }
    };

    const handleDeleteClick = (user) => {
        if (eliminatingUser && eliminatingUser.ID_Solicitud_WEB === user.ID_Solicitud_WEB) {
            setEliminatingUser(null); // Si el mismo ejercicio está seleccionado, oculta el formulario de edición
        } else {
            if (expandedRow && expandedRow !== user.ID_Solicitud_WEB) {
                setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
                setSelectedUser(null);
                setAddingUser(null);
            }
            setExpandedRow(null);
            setSelectedUser(null);
            setAddingUser(null);
            setEliminatingUser(user);
        }
    };

    return (
        <div className="container2">
            <ul className='cardcontainer'>
                {users.map((user) => (
                    <li key={user.ID_Solicitud_WEB} className={`row ${((selectedUser && selectedUser.ID_Solicitud_WEB === user.ID_Solicitud_WEB) || (addingUser && addingUser.ID_Solicitud_WEB === user.ID_Solicitud_WEB) || (eliminatingUser && eliminatingUser.ID_Solicitud_WEB === user.ID_Solicitud_WEB)) ? 'selected' : ''}`}>
                        <div onClick={() => handleRowClick(user)} className={`row_header ${((selectedUser && selectedUser.ID_Solicitud_WEB === user.ID_Solicitud_WEB) || (addingUser && addingUser.ID_Solicitud_WEB === user.ID_Solicitud_WEB) || (eliminatingUser && eliminatingUser.ID_Solicitud_WEB === user.ID_Solicitud_WEB)) ? 'selected' : ''}`}>
                            <div>
                                <div className='row_name'>{user.nombre} {user.apellido}</div>
                                <div className='row_description'>{user.tipo_servicio}</div>
                            </div>
                            <div className="row_buttons">
                                <div className="row_edit">
                                    <i className={`bi bi-database-add card-icon ${addingUser && addingUser.ID_Solicitud_WEB === user.ID_Solicitud_WEB ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleAddClick(user); }}></i>
                                </div>
                                <div className="row_edit">
                                    <i className={`bi bi-trash card-icon ${eliminatingUser && eliminatingUser.ID_Solicitud_WEB === user.ID_Solicitud_WEB ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleDeleteClick(user); }}></i>
                                </div>
                            </div>
                        </div>
                        {expandedRow === user.ID_Solicitud_WEB && (
                            <>
                                <div className="exercise-info">
                                    <div className="exercise-info-column">
<div className="exercise-info-row">Foto de perfil: <img src={user.foto_perfil} alt="Foto de perfil" style={{ width: '100px', height: '100px' }} /></div>

                                    </div>
                                    <div className="exercise-info-column">
                                        <div className="exercise-info-row">Email: {user.correo}</div>
                                        <div className="exercise-info-row">Nacimiento: {new Date(user.fecha_nacimiento.split('T')[0]).toLocaleDateString()}</div>
                                        <div className="exercise-info-row">Certificado: <a href={user.titulos} target="_blank" rel="noopener noreferrer">Ver certificado</a></div>
                                        <div className="exercise-info-row">Experiencia: {user.experiencia_laboral}</div>
                                    </div>
                                </div>
                            </>
                        )}
                        {addingUser && addingUser.ID_Solicitud_WEB === user.ID_Solicitud_WEB && (
                            <RequestTrainersNutricionistAdd user={addingUser} />
                        )}
                        {eliminatingUser && eliminatingUser.ID_Solicitud_WEB === user.ID_Solicitud_WEB && (
                            <RequestTrainersNutricionistDelete user={eliminatingUser} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
