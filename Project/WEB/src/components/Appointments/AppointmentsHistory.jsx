import React, { useState, useEffect } from 'react';
import SearchBar from '../SearchBar';
import '../../styles/Management.css';
import config from "../../utils/conf";
import { useMsal } from "@azure/msal-react";

export default function AppointmentsHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const senderId = activeAccount.idTokenClaims?.oid; 

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/citasaceptadas/${senderId}`, {
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
    (appointment.estado === 'Completada')
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
          <li key={appointment.ID_Cita} className={`row ${((selectedAppointment && selectedAppointment.ID_Cita === appointment.ID_Cita) ) ? 'selected' : ''}`}>
            <div onClick={() => handleRowClick(appointment)} className={`row_header ${((selectedAppointment && selectedAppointment.ID_Cita === appointment.ID_Cita)) ? 'selected' : ''}`}>
              <div>
                <div className='row_name'>Cliente: {appointment.nombre} {appointment.apellido}</div>
                <div className='row_description'>{appointment.estado} el {appointment.fecha}</div>
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
