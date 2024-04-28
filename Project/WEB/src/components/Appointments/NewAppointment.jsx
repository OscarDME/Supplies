import React, { useState, useEffect } from 'react';
import '../../styles/Management.css';
import { addLocale } from 'primereact/api';
import { Calendar } from 'primereact/calendar';
import Dropdown from '../DropdownCollections';
import { UserCard } from '../DATA_USER_CARD';
import { useMsal } from "@azure/msal-react";
import config from "../../utils/conf";

export default function NewAppointments({ onBackToList }) {
    const [clientOptions, setClientOptions] = useState([]);
    const [client, setClient] = useState('');
    const [endsAt, setEndsAt] = useState('');
    const [startsAt, setStartsAt] = useState('');
    const [place, setPlace] = useState(null);
    const [detail, setDetail] = useState('');
    const [date, setDate] = useState(null);
    const [fetchingClients, setFetchingClients] = useState(true); // Estado para controlar si la llamada a la API está en curso
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const senderOID = activeAccount.idTokenClaims?.oid;

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

    const handleClientChange = (selectedOption) => {
        setClient(selectedOption ?? null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validación del enlace de Google Maps
        const regex = /^(https:\/\/(www\.google\.com\/maps\/|goo\.gl\/maps\/|maps\.app\.goo\.gl\/).+)$/;
        if (!regex.test(place)) {
            alert("Por favor, ingresa un enlace válido de Google Maps.");
            return;
        }

        // Validaciones de campos vacíos y longitud de detalles
        if (!client || !endsAt || !startsAt || !place || !date) {
            alert("Por favor, completa todos los campos requeridos.");
            return;
        }

        if (detail.length > 200) {
            alert("Los detalles no deben exceder los 200 caracteres.");
            return;
        }


        const selectedDate = new Date(date);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate < currentDate) {
            alert("La fecha de la cita debe ser hoy o una fecha futura.");
            return;
        }

        // Combina la fecha con las horas de inicio y finalización para obtener objetos Date completos
        const startTime = new Date(date);
        startTime.setHours(new Date(startsAt).getHours(), new Date(startsAt).getMinutes());

        const endTime = new Date(date);
        endTime.setHours(new Date(endsAt).getHours(), new Date(endsAt).getMinutes());

        // Verifica que la hora de inicio no sea mayor que la hora de finalización
        if (startTime >= endTime) {
            alert("La hora de inicio debe ser menor que la hora de finalización.");
            return;
        }

        const citaData = {
          ID_Usuario: senderOID, 
          ID_UsuarioCliente: client.value, // Asegúrate de que `client` contenga el valor correcto que esperas
          fecha: selectedDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
          hora_inicio: startTime.toTimeString().split(' ')[0], // Formato HH:MM:SS
          hora_final: endTime.toTimeString().split(' ')[0], // Formato HH:MM:SS
          lugar: place,
          detalles: detail,
          ID_EstadoCita: 1 // Asume un estado por defecto o modifica según necesites
      };
  
      try {
          const response = await fetch(`${config.apiBaseUrl}/cita`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(citaData)
          });
  
          if (!response.ok) {
              throw new Error('No se pudo crear la cita');
          }
  
          const responseData = await response.json();
          alert('Cita creada exitosamente');
          onBackToList(); // Regresar a la lista después de crear la cita
      } catch (error) {
          console.error('Error al crear la cita:', error);
          alert('Error al crear la cita');
      }
    };


    return (
        <div className='container2 MainContainer'>
            <div className='add_header2'>
                <button className="back_icon card-icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i> </button>
                <h1 className='mtitle'>Agendar una nueva cita</h1>
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
                            <input type="text" className='add_exercise_input' value={place} onChange={handlePlaceChange} />
                        </div>
                    </div>
                    <div>
                        <div className='add_exercise_rows'>
                            Fecha de la cita
                            <Calendar className='p-calendar' value={date} onChange={(e) => setDate(e.value)} locale="es" dateFormat="dd/mm/yy" />
                        </div>
                        <div className='add_exercise_rows'>
                            Hora de inicio
                            <Calendar value={startsAt} onChange={(e) => setStartsAt(e.value)} timeOnly />
                        </div>
                        <div className='add_exercise_rows'>
                            Hora de finalización
                            <Calendar value={endsAt} onChange={(e) => setEndsAt(e.value)} timeOnly />
                        </div>
                    </div>
                </div>
                <button className='add_button'>Agregar cita</button>
            </form>
        </div>
    )
}
