import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';
import config from "../../../utils/conf";


export default function RequestExercisesDelete({ exercise }) {

    const [reason, setReason] = useState('');

    const handleReasonChange = (event) => setReason(event.target.value);


    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!reason) {
        alert('Tiene que escribir una razon para rechazar la solicitud.');
        return;
      }
    
      // Define la URL del endpoint del servidor para eliminar el ejercicio
      const url = `${config.apiBaseUrl}/ejercicio/${exercise.ID_Ejercicio}`; // Ajusta según tu configuración
    
      try {
        const response = await fetch(url, {
          method: 'DELETE', // Asegúrate de que el método corresponda con lo que tu backend espera
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          }),
        });
    
        if (!response.ok) {
          throw new Error('Algo salió mal al intentar eliminar el ejercicio.');
        }
    
        // Opcional: respuesta del servidor
        const result = await response.json();
        console.log(result); // Mostrar el resultado por consola o manejarlo como necesites
    
        alert('Ejercicio eliminado con éxito.');
        window.location.reload(); // Recarga la página después de actualizar el estado del ejercicio

        // Redireccionar o actualizar la lista de ejercicios aquí
        // Por ejemplo, puedes llamar a una función que actualice el estado de la lista de ejercicios en un componente padre
      } catch (error) {
        console.error('Error al eliminar el ejercicio:', error);
        alert('Error al eliminar el ejercicio.');
      }
    };
    
    const ES_CARDIOVASCULAR = "Cardiovascular";

  return (
    <div className='container-edit'>
      <form className='form_add_exercise' onSubmit={handleSubmit}>
        <div className='add_exercise_area'>
        <div className="exercise-info">
                      <div className="exercise-info-column">
                      <div className="exercise-info-row">Dificultad: {exercise.Dificultad}</div>
                      {/* Verifica si hay equipo necesario, si no, muestra "Ninguno" */}
                      <div className="exercise-info-row">Equipo Necesario: {exercise.Equipo || "Ninguno"}</div>
                      <div className="exercise-info-row">Tipo de ejercicio: {exercise.Tipo_Ejercicio}</div>
                      <div className="exercise-info-row">Modalidad: {exercise.Modalidad}</div>
                      {/* Verifica si hay lesión que afecta, si no, muestra "Ninguna" */}
                      <div className="exercise-info-row">Lesión que afecta: {exercise.Lesion || "Ninguna"}</div>
                      {/* Condicionalmente muestra músculos secundarios */}
                      {exercise.Modalidad !== ES_CARDIOVASCULAR && (
                        <div className='row_description'>
                          Músculos Secundarios: 
                          {exercise.musculosSecundarios && exercise.musculosSecundarios.length > 0 
                            ? exercise.musculosSecundarios.map(ms => ms.descripcion).join(", ") 
                            : "Ninguno"}
                        </div>    
                      )}
                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Posición inicial: {exercise.preparacion}</div>
                        <div className="exercise-info-row">Ejecucion: {exercise.ejecucion}</div>
                        </div>
                    </div>
            </div>
            <div className='add_exercise_rows2'>
              Razón de rechazo:
              <textarea className='add_exercise_textarea' value={reason} onChange={handleReasonChange} ></textarea>
            </div>
        <button type="submit" className='delete_button'>Rechazar solicitud</button>
      </form>
    </div>
  );
}
