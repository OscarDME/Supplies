import React , {useState, useEffect}from 'react'
import { DATA_DIET } from '../DATA_DIET'
import { useMsal } from "@azure/msal-react";
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import config from "../../utils/conf";


const USED_DAYS = [new Date(2024, 1, 5), new Date(2024, 1, 15)];// Año, mes (0-indexado), día

export default function AssignDietsCalendar({client, createdDiet}) {

    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const [dietPlan, setDietPlan] = useState([]);

    useEffect(() => {
        const fetchDietasActivas = async () => {
            try {
                // Asume que tienes el ID del usuario disponible en `client.id`
                const response = await fetch(`${config.apiBaseUrl}/dieta/${client.ID_Usuario}`);
                if (!response.ok) {
                    throw new Error('Error al obtener las dietas activas');
                }
                const dietasActivas = await response.json();
                setDietPlan(dietasActivas);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchDietasActivas();
    }, [client.id]);    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = month === 0 ? 11 : month - 1;
    let prevYear = prevMonth === 11 ? year - 1 : year;
    let minDate = new Date();
    minDate.setMonth(prevMonth);
    minDate.setFullYear(prevYear);
    const [date, setDate] = useState(null);

    console.log(createdDiet);

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


  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedStartDate = new Date(date[0]);
    const selectedEndDate = new Date(date[1]);

    // Validación de solapamiento de fechas
    const isOverlap = dietPlan.some(diet => {
        const dietStartDate = new Date(diet.fecha_inicio);
        const dietEndDate = new Date(diet.fecha_fin);
        return (selectedStartDate <= dietEndDate && selectedEndDate >= dietStartDate);
    });

    if (isOverlap) {
        alert("El usuario ya tiene una dieta asignada en el rango de fechas seleccionado.");
        return;
    }

  
    // Verifica si createdDiet existe
    if (!createdDiet) {
      alert("No se ha creado ninguna dieta.");
      return;
    }
  
    // Verifica si el nombre de la dieta está presente
    if (!createdDiet.name || createdDiet.name.trim() === "") {
      alert("Por favor, especifica un nombre para la dieta.");
      return;
    }
  
    // Verifica las fechas de asignación
    if (!date || date.length !== 2) {
      alert("Por favor, selecciona un rango de fechas para la asignación de la dieta.");
      return;
    }
  
    // Verifica si hay al menos una comida por día
    const hasMealEachDay = createdDiet.days.every(day => day.meals && day.meals.length > 0);
    if (!hasMealEachDay) {
      alert("Asegúrate de que cada día tenga al menos una comida.");
      return;
    }

    if (!date || date.length !== 2 || !date[0] || !date[1]) {
      alert("Por favor, selecciona un rango de fechas para la asignación de la dieta.");
      return;
    }  
  
    // Verifica si cada comida tiene un ID válido (mealTimeId) y al menos un alimento
    for (const day of createdDiet.days) {
      for (const meal of day.meals) {
        if (!meal.mealTimeId) {
          alert("Cada comida debe tener un ID válido.");
          return;
        }
        if (!meal.foods || meal.foods.length === 0) {
          alert("Asegúrate de que cada comida tenga al menos un alimento.");
          return;
        }
        for (const food of meal.foods) {
          if (!food.name || food.name.trim() === "" || !food.portion || food.portion <= 0) {
            alert("Asegúrate de que cada alimento tenga un nombre y una porción válidos.");
            return;
          }
        }
      }
    }

    // Conversión de las fechas seleccionadas a objetos Date
    

    console.log(date);
    const formattedStartDate = date[0].toISOString().slice(0, 10); // Formato YYYY-MM-DD
    const formattedEndDate = date[1].toISOString().slice(0, 10); // Formato YYYY-MM-DD

    console.log(formattedStartDate);
    console.log(formattedEndDate);
  
    // Preparar datos de la dieta para enviar
    const dietDataToSend = {
      ...createdDiet,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    console.log(dietDataToSend);
  
    // Envía los datos a tu API
    try {
      const response = await fetch(`${config.apiBaseUrl}/dieta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dietDataToSend),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Dieta guardada con éxito:', responseData);
      alert('Dieta asignada con éxito.');
      // Realizar acciones posteriores, como limpiar el formulario o actualizar el estado
    } catch (error) {
      console.error('Error al guardar la dieta:', error);
      alert('Error al asignar la dieta. Por favor, inténtalo de nuevo.');
    }
  };
  return (
    <>
    <h2 className='MainTitle'>Dietas activas de {client.nombre_usuario}</h2>
    <div className='active-diet-container'>
    {dietPlan.map((diet, index)  => (  
        <>
        <div key={index} className='active-diet-card'>
            <h4>{diet.nombre}</h4>
            <div>
            <p>Fecha de inicio: {diet.fecha_inicio.slice(0, 10)}</p>
            <p>Fecha de finalización: {diet.fecha_fin.slice(0, 10)}</p>
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
      <button className='add_button add-btn2' type='submit'>Asignar Dieta</button>
      </div>
    </form>
    </>
  )
}




        