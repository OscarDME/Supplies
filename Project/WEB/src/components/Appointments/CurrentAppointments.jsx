import React, { useState, useEffect } from 'react';
import { APPOINTMENTS } from "../DATA_APPOINTMENTS";
import SearchBar from '../SearchBar';
import '../../styles/Management.css';
import config from "../../utils/conf";
import NewAppointment from './NewAppointment'; // Cambiado a NewAppointment
import { useMsal } from "@azure/msal-react";

export default function CurrentAppointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Cambiado a setSelectedAppointment
  const [expandedRow, setExpandedRow] = useState(null);
  const [showAddPage, setShowAddPage] = useState(false);
  const [cancelAppointment, setCancelAppointment] = useState(false);
  const [appointments, setAppointments] = useState([]); // Cambiado a appointments

  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const senderId = activeAccount.idTokenClaims?.oid; 

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/cita/${senderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('There was an error fetching the appointments:', error);
      }
    };
  
    fetchAppointments();
  }, [senderId]);
  



  const filteredAppointments = appointments.filter(appointment =>
    appointment.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (appointment.estado === 'Pendiente' || appointment.estado === 'Aceptada')
  );

  const handleRowClick = (appointment) => {
    if (expandedRow === appointment.ID_Cita) { // Cambiado a ID_Cita
      setExpandedRow(null);
      setSelectedAppointment(null);
      setCancelAppointment(null);
    } else {
      if (cancelAppointment && cancelAppointment.ID_Cita === appointment.ID_Cita) { // Cambiado a ID_Cita
        setCancelAppointment(null);
      }
      setExpandedRow(appointment.ID_Cita); // Cambiado a ID_Cita
      setCancelAppointment(null);
      setSelectedAppointment(appointment); // Cambiado a appointment
    }
  };

  const handleCancelClick = (appointment) => {
    if (cancelAppointment && cancelAppointment.ID_Cita === appointment.ID_Cita) { // Cambiado a ID_Cita
      setExpandedRow(null);
      setSelectedAppointment(null);
      setCancelAppointment(null);
    } else {
      if (expandedRow && expandedRow !== appointment.ID_Cita) { // Cambiado a ID_Cita
        setExpandedRow(null);
        setSelectedAppointment(null);
      }
      setExpandedRow(null);
      setSelectedAppointment(null);
      setCancelAppointment(appointment); // Cambiado a appointment
    }
  };
  
  const handleAddClick = () => {
    setShowAddPage(true);
  };

  const handleBackToList = () => {
    setShowAddPage(false);
  };

  const handleCancelAppointment = async (ID_Cita) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/cancelarcita/${ID_Cita}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('No se pudo cancelar la cita');
      }
  
      const updatedAppointments = appointments.filter(appointment => appointment.ID_Cita !== ID_Cita);
      setAppointments(updatedAppointments);
  
      alert('Cita cancelada exitosamente');
      window.location.reload();
    } catch (error) {
      console.error('Error al cancelar la cita:', error);
      alert('Error al cancelar la cita');
    }
  };
  

  if (showAddPage) {
    return <NewAppointment onBackToList={handleBackToList} />; // Cambiado a NewAppointment
  }

  return (
    <div className="container">
      <div className="search-bar-container">
        <div className='search-bar'>
          <div className='addclient'><i className="bi bi-search h4"></i></div>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div>
          <a className="iconadd" role="button" onClick={handleAddClick}><i className="bi bi-plus-circle-fill"></i></a>
        </div>
      </div>
      <ul className='cardcontainer'>
        {filteredAppointments.map((appointment) => (
          <li key={appointment.ID_Cita} className={`row ${((selectedAppointment && selectedAppointment.ID_Cita === appointment.ID_Cita) || (cancelAppointment && cancelAppointment.ID_Cita === appointment.ID_Cita) ) ? 'selected' : ''}`}>
            <div onClick={() => handleRowClick(appointment)} className={`row_header ${((selectedAppointment && selectedAppointment.ID_Cita === appointment.ID_Cita) || (cancelAppointment && cancelAppointment.ID_Cita === appointment.ID_Cita)) ? 'selected' : ''}`}>
              <div>
                <div className='row_name'>Cliente: {appointment.nombre} {appointment.apellido}</div> {/* Cambiado a nombre y apellido */}
                <div className='row_description'>{appointment.estado} para el {appointment.fecha}</div> {/* Cambiado a estado y fecha */}
              </div>
              <div className="row_edit">
                <i className={`bi bi-trash card-icon ${cancelAppointment && cancelAppointment.ID_Cita === appointment.ID_Cita ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleCancelClick(appointment); }}></i>
              </div>
            </div>
            {expandedRow === appointment.ID_Cita && ( 
              <>
                <div className="exercise-info">
                  <div className="exercise-info-column">
                    <div className="exercise-info-row">
                      Fecha de la cita: {appointment.fecha}
                    </div>
                    <div className="exercise-info-row">
                      Inicio de la cita: {appointment.hora_inicio} 
                    </div>
                    <div className="exercise-info-row">
                      Fin de la cita: {appointment.hora_final}
                    </div>
                  </div>
                  <div className="exercise-info-column">
                    <div className="exercise-info-row">
                      <a href={appointment.lugar} target="_blank"> Lugar de la cita</a> 
                    </div>
                    <div className="exercise-info-row">
                      Detalles extra: {appointment.detalles} 
                    </div>
                  </div>
                </div>
              </>
            )}
            {cancelAppointment && cancelAppointment.ID_Cita === appointment.ID_Cita && (
              <div className="exercise-info">
              <button onClick={() => handleCancelAppointment(appointment.ID_Cita)} className="delete_button">
                  Cancelar cita
              </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
