import React , {useState, useEffect}from 'react'
import { useMsal } from "@azure/msal-react";
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { RoutineCard } from '../DATA_NEW_ROUTINES';
import config from "../../utils/conf";


const USED_DAYS = [new Date(2024, 1, 5), new Date(2024, 1, 15)];// Año, mes (0-indexado), día

export default function AssignRoutinesCalendar({client, selectedUser,updatedRoutine}) {

    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const senderId = activeAccount.idTokenClaims?.oid;
    const [routines, setRoutines] = useState([]);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/rutinasasignar/${selectedUser.ID_Usuario}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRoutines(data);
                    console.log("Rutinas activas cargadas", data);
                } else {
                    console.error("Error al obtener las rutinas activas:", response.statusText);
                }
            } catch (error) {
                console.error("Error al obtener las rutinas activas:", error);
            }
        };

        fetchRoutines();
    }, [senderId]);  
      
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = month === 0 ? 11 : month - 1;
    let prevYear = prevMonth === 11 ? year - 1 : year;
    let minDate = new Date();
    minDate.setMonth(prevMonth);
    minDate.setFullYear(prevYear);
    const [date, setDate] = useState(null);

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

  const isDayUsed = (dateObj) => {
    // Debes convertir el objeto de fecha de PrimeReact a un objeto Date de JavaScript
    const dateToCheck = new Date(dateObj.year, dateObj.month, dateObj.day);
  
    return USED_DAYS.some(usedDate =>
      dateToCheck.getDate() === usedDate.getDate() &&
      dateToCheck.getMonth() === usedDate.getMonth() &&
      dateToCheck.getFullYear() === usedDate.getFullYear()
    );
  };
  
  // Ajusta la función alreadyUsedDays para utilizar la nueva isDayUsed
  const alreadyUsedDays = (dateObj) => {
    if (isDayUsed(dateObj)) {
      return (
        <strong style={{ textDecoration: 'line-through', color: 'red' }}>{dateObj.day}</strong>
      );
    }
    return dateObj.day;
  };

  useEffect(()=>{
    console.log("Rutinas cargadas" + updatedRoutine);
  }, [])


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const isOverlap = routines.some(routine => {
        const routineStartDate = new Date(routine.fecha_inicio);
        const routineEndDate = new Date(routine.fecha_fin);
        return (
          date[0] <= routineEndDate && date[date.length - 1] >= routineStartDate
        );
      });
  
      if (isOverlap) {
        alert("El usuario ya tiene una rutina asignada en el rango de fechas seleccionado.");
        return;
      }
  
      // Verifica si updatedRoutine existe
      if (!updatedRoutine) {
        alert("No se ha creado ninguna rutina.");
        return;
      }
  
  
      // Verifica las fechas de asignación
      if (!date || date.length < 2 || !date[0] || !date[date.length - 1]) {
        alert("Por favor, selecciona un rango de fechas para la asignación de la rutina.");
        return;
      }

      const formattedStartDate = date[0].toISOString().slice(0, 10); // Formato YYYY-MM-DD
      const formattedEndDate = date[1].toISOString().slice(0, 10); // Formato YYYY-MM-DD
  
      console.log(formattedStartDate);
      console.log(formattedEndDate);

      // Preparar datos de la rutina para enviar
      const body = JSON.stringify({
        ID_Usuario: senderId,
        ID_Movil: selectedUser.ID_Usuario,
        routineName: updatedRoutine.nombre,
        days: updatedRoutine.diasEntreno, // Ajusta según la estructura de tu rutina
        fechaInicio: formattedStartDate, // Formato ISO de la fecha de inicio
        fechaFin: formattedEndDate, // Formato ISO de la fecha de fin
      });
  
      console.log(body);
  
      // Realiza la llamada a tu API para crear y asignar la rutina
      const response = await fetch(`${config.apiBaseUrl}/rutinaasignar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
  
      if (response.ok) {
        console.log("Rutina asignada correctamente al cliente.");
        alert("Rutina asignada correctamente al cliente.");
        // Realiza cualquier acción adicional que desees después de asignar la rutina, como limpiar el formulario o actualizar el estado.
      } else {
        console.error("Error al asignar la rutina al cliente:", response.statusText);
        alert("Error al asignar la rutina al cliente. Por favor, inténtalo de nuevo.");
        // Maneja el error de acuerdo a tus necesidades.
      }
    } catch (error) {
      console.error("Error en la asignación de la rutina al cliente:", error);
      alert("Error en la asignación de la rutina al cliente. Por favor, inténtalo de nuevo.");
      // Maneja el error de acuerdo a tus necesidades.
    }
  };
  

  return (
    <>
    <h2 className='MainTitle'>Rutinas activas de {selectedUser.username}</h2>
    <div className='active-diet-container'>
    {routines.map((routine, index)  => (  
        <>
        <div key={index} className='active-diet-card'>
            <h4>{routine.NombreRutina}</h4>
            <div>
            <div>Fecha de inicio: {routine.fecha_inicio} </div>
            <div>Fecha de finalización: {routine.fecha_fin}</div>
            </div>
        </div>
        </>
        ))}
    </div>
    <form className='calendar-container' onSubmit={handleSubmit}>
    <div className='calendar-ind-container'>
    Elegir fechas de asignación:
    <div className="card flex justify-content-center">
            <Calendar className='p-calendar' value={date} onChange={(e) => setDate(e.value)}  dateTemplate={alreadyUsedDays}  locale="es" minDate={minDate} dateFormat="dd/mm/yy" inline  selectionMode="range"/>
        </div>
      <div>
      </div>
      <button className='add_button add-btn2' type='submit'>Asignar Rutina</button>
      </div>
    </form>
    </>
  )
}




        