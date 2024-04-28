import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';
import config from "../../../utils/conf";


export default function  RequestRecipesDelete({ recipe }) {

  const [reason, setReason] = useState('');

  const handleReasonChange = (event) => setReason(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!reason) { 
      alert('Especifique una razón de rechazo');
      return;
    }

    if (!recipe.ID_Receta) {
      alert('No se ha proporcionado el ID de la receta.');
      return;
    }

    try {
      const url = `${config.apiBaseUrl}/receta/${recipe.ID_Receta}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al rechazar la solicitud de la receta');
      }

      alert('La receta ha sido rechazada exitosamente.');
      window.location.reload();

    } catch (error) {
      console.error('Error al rechazar la solicitud de la receta:', error);
      alert('Error al rechazar la solicitud de la receta.');
    }
  };

  return (
    <div className='container-edit'>
      <form onSubmit={handleSubmit}>
        <div className='form_add'>
        <div className="exercise-info">
                  <div className="exercise-info-column">
                    <div className="exercise-info-row">
                      Calorías totales: {recipe.calorias} kcal
                    </div>
                    {recipe.macronutrientes.map((macro) => (
                      <div
                        key={macro.ID_Macronutriente}
                        className="exercise-info-row"
                      >
                        {macro.ID_Macronutriente === 1 &&
                          `Grasas: ${macro.cantidad}g`}
                        {macro.ID_Macronutriente === 2 &&
                          `Carbohidratos: ${macro.cantidad}g`}
                        {macro.ID_Macronutriente === 3 &&
                          `Proteínas: ${macro.cantidad}g`}
                      </div>
                    ))}
                  </div>
                  <div className="exercise-info-column">
                    Ingredientes:{" "}
                    {recipe.ingredientes.map((ing, index) => (
                      <span key={index}>
                        {`${ing.nombre} (${ing.porcion}g)`}
                        {index < recipe.ingredientes.length - 1 ? ", " : ""}
                      </span>
                    ))}
                    <div className="exercise-info-row">
                      Preparación: {recipe.preparacion}
                    </div>
                    <div className="exercise-info-row">
                      Link de preparación: {recipe.link}
                    </div>
                  </div>
                </div>
        </div>
        <div className='button_container'>
        <div className='add_exercise_rows2'>
              Razón de rechazo:
              <textarea className='add_exercise_textarea' value={reason} onChange={handleReasonChange} ></textarea>
            </div>
        <button className='delete_button'>Rechazar solicitud</button>
        </div>
      </form>
    </div>
  );
}