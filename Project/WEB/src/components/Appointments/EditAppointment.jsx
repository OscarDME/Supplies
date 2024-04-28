import React, { useState, useEffect } from 'react';
import '../../styles/Management.css';
import { addLocale } from 'primereact/api';
import { Calendar } from 'primereact/calendar';
import Dropdown from '../DropdownCollections';
import { UserCard } from '../DATA_USER_CARD';
import { useMsal } from "@azure/msal-react";
import config from "../../utils/conf";


export default function EditAppointment({ onBackToList, appointment }) {
    const [clientOptions, setClientOptions] = useState([]);
    const [fetchingClients, setFetchingClients] = useState(true); // Estado para controlar si la llamada a la API está en curso
    const [client, setClient] = useState('');
    const [endsAt, setEndsAt] = useState(null);
    const [startsAt, setStartsAt] = useState(null);
    const [place, setPlace] = useState('');
    const [detail, setDetail] = useState('');
    const [date, setDate] = useState(null);

    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const senderOID = activeAccount.idTokenClaims?.oid;

    useEffect(() => {
      const selectedClient = clientOptions.find(option => option.value === appointment.ID_Usuario);
      
      if (selectedClient) {
          setClient(selectedClient);
      }
      
  }, [clientOptions, appointment]);

    useEffect(() => {
        const fetchClients = async () => {
            if (!activeAccount || !fetchingClients) return; // Evitar llamadas adicionales si fetchingClients es false
            try {
                const response = await fetch(`${config.apiBaseUrl}/allClients/${senderOID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const options = data.map(user => ({
                    label: `${user.nombre} ${user.apellido}`,
                    value: user.ID_Usuario
                }));
                setClientOptions(options);
                setFetchingClients(false); // Actualizar el estado para indicar que la llamada a la API ha terminado
            } catch (error) {
                console.error('There was an error fetching the clients:', error);
                setFetchingClients(false); // En caso de error, asegurarse de actualizar el estado para evitar bucles infinitos
            }
        };

        fetchClients();
    }, [activeAccount, fetchingClients]);

    useEffect(() => {
      const baseDate = new Date();

        const [startHour, startMinutes] = appointment.hora_inicio.split(':').map(Number);
        const [endHour, endMinutes] = appointment.hora_final.split(':').map(Number);

        const startDate = new Date(baseDate.setHours(startHour, startMinutes, 0));
        const endDate = new Date(baseDate.setHours(endHour, endMinutes, 0));
        setStartsAt(startDate);
        setEndsAt(endDate);    
        setPlace(appointment.lugar);
        setDetail(appointment.detalles);
        const [year, month, day] = appointment.fecha.split('-').map(Number);
        setDate(new Date(year, month - 1, day))    }, [appointment]);

    addLocale('es', {
        firstDayOfWeek: 1,
        showMonthAfterYear: true,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Hoy',
        clear: 'Limpiar'
    });

    const handlePlaceChange = (event) => setPlace(event.target.value);
    const handleDetailsChange = (event) => setDetail(event.target.value);

    const handleSubmit = async (event) => {
      event.preventDefault();
  
      const formattedDate = date.toISOString().slice(0, 10); 
      const formattedStartTime = startsAt.toISOString().slice(11, 19);
      const formattedEndTime = endsAt.toISOString().slice(11, 19);

      const citaData = {
          ID_UsuarioCliente: client.value, 
          ID_Usuario: senderOID, 
          fecha: formattedDate,
          hora_inicio: startsAt.toTimeString().split(' ')[0], 
          hora_final: endsAt.toTimeString().split(' ')[0], 
          lugar: place,
          detalles: detail,
      };
      
      console.log(citaData);

      try {
          // Suponiendo que tienes una URL de endpoint específica para actualizar citas
          const response = await fetch(`${config.apiBaseUrl}/cita/${appointment.ID_Cita}`, {
              method: 'PUT', // Usar método PUT para actualización
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(citaData),
          });
  
          if (!response.ok) {
              throw new Error('Error al actualizar la cita');
          }
  
          const responseData = await response.json();
          console.log(responseData.message);
          alert('Cita actualizada exitosamente');
          onBackToList(); // Vuelve a la lista de citas o al lugar apropiado
      } catch (error) {
          console.error('Error al actualizar la cita:', error);
          alert('Error al actualizar la cita');
      }
  };

    const handleClientChange = (selectedClient) => {
      setClient(selectedClient); // Actualiza el cliente seleccionado
  };

    return (
        <div className='container2 MainContainer'>
            <div className='add_header2'>
                <button className="back_icon card-icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i> </button>
                <h1 className='mtitle'>Modificar cita</h1>
            </div>
            <form className='form_add_exercise' onSubmit={handleSubmit}>
                <div className='add_exercise_area'>
                    <div>
                        <div className='add_exercise_rows'>
                            ¿A cuál cliente quiere agendar una cita? 
                            <Dropdown options={clientOptions} selectedOption={client} onChange={handleClientChange} />
                        </div>
                        <div className='add_exercise_rows'>
                            Detalles o notas extras de la cita
                            <textarea
                                className="add_exercise_textarea"
                                value={detail}
                                onChange={handleDetailsChange}
                            ></textarea>
                        </div>
                        <div className='add_exercise_rows'>
                            Lugar de la cita
                            <input type="text" className='add_exercise_input' value={place} onChange={handlePlaceChange}  />
                        </div>
                    </div>
                    <div>
                        <div className='add_exercise_rows'>
                            Fecha de la cita
                            <Calendar className='p-calendar' value={date} onChange={(e) => setDate(e.value)} locale="es" dateFormat="dd/mm/yy"/>
                        </div>
                        <div className='add_exercise_rows'>
                            Hora de inicio
                            <Calendar value={startsAt} onChange={(e) => setStartsAt(e.value)} timeOnly hourFormat="24" />
                        </div>
                        <div className='add_exercise_rows'>
                            Hora de finalización
                            <Calendar value={endsAt} onChange={(e) => setEndsAt(e.value)} timeOnly hourFormat="24" />
                        </div>
                    </div>
                </div>
                <button className='add_button'>Modificar</button>
            </form>
        </div>
    )
}
