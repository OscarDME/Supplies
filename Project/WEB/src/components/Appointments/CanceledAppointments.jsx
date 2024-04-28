import React, { useState, useEffect } from 'react';
import SearchBar from '../SearchBar';
import '../../styles/Management.css';
import config from "../../utils/conf";
import EditAppointment from './EditAppointment';
import { useMsal } from "@azure/msal-react";

export default function CanceledAppointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showEditPage, setShowEditPage] = useState(false);
  const [canceledAppointments, setCanceledAppointments] = useState([]);

  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const senderId = activeAccount.idTokenClaims?.oid; 

  useEffect(() => {
    const fetchCanceledAppointments = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/citasrechazadas/${senderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let data = await response.json();
        setCanceledAppointments(data);
      } catch (error) {
        console.error('There was an error fetching the canceled appointments:', error);
      }
    };
  
    fetchCanceledAppointments();
  }, [senderId]);

  const filteredAppointments = canceledAppointments.filter(appointment =>
    appointment.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (appointment.estado === 'Rechazada' || appointment.estado === 'Cancelada')
  );

  const handleRowClick = (appointment) => {
    if (expandedRow === appointment.ID_Cita) {
      setExpandedRow(null);
      setSelectedAppointment(null);
    } else {
      setExpandedRow(appointment.ID_Cita);
      setSelectedAppointment(appointment);
    }
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);      
    setShowEditPage(true); 
  };

  const handleBackToList = () => {
    setShowEditPage(false); 
  };

  if (showEditPage) {
    return <EditAppointment onBackToList={handleBackToList} appointment={selectedAppointment} />;
  }

  return (
    <div className="container">
      <div className="search-bar-container">
        <div className='search-bar'>
          <div className='addclient'><i className="bi bi-search h4"></i></div>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>
      <ul className='cardcontainer'>
        {filteredAppointments.map((appointment) => (
          <li key={appointment.ID_Cita} className={`row ${selectedAppointment && selectedAppointment.ID_Cita === appointment.ID_Cita ? 'selected' : ''}`}>
            <div onClick={() => handleRowClick(appointment)} className={`row_header ${selectedAppointment && selectedAppointment.ID_Cita === appointment.ID_Cita ? 'selected' : ''}`}>
              <div>
                <div className='row_name'>Cliente: {appointment.nombre} {appointment.apellido}</div>
                <div className='row_description'>{appointment.estado} para el {appointment.fecha}</div>
              </div>
              <div className="row_edit">
                <i className={`bi bi-pencil-square card-icon`} onClick={(e) => { e.stopPropagation(); handleEditClick(appointment); }}></i>
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
          </li>
        ))}
      </ul>
    </div>
  );
}
