import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';
import config from "../../../utils/conf";


export default function RequestExercisesAdd({ exercise }) {


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${config.apiBaseUrl}/estadoejercicio/${exercise.ID_Ejercicio}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: true }), // Cambia el estado según tus necesidades
      });
      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado del ejercicio');
      }
      alert('Estado del ejercicio actualizado correctamente');
      window.location.reload(); // Recarga la página después de actualizar el estado del ejercicio
    } catch (error) {
      console.error('Error al actualizar el estado del ejercicio:', error);
      alert('Error al actualizar el estado del ejercicio');
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
        <button type="submit" className='add_button'>Añadir a la base de datos</button>
      </form>
    </div>
  );
}
