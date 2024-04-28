import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';
import config from "../../../utils/conf";

export default function  RequestFoodsDelete({ food }) {
  
  const [reason, setReason] = useState('');

  const handleReasonChange = (event) => setReason(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!food.nombre || !food.calorias || !food.categoria || !food.peso || !food.calorias) { 
      alert('El alimento no cuenta con todos los campos necesarios para ser agregado a la base de datos.');
      return;
    }
    try {
      // Envía la solicitud DELETE al servidor
      const response = await fetch(`${config.apiBaseUrl}/alimento/${food.ID_Alimento}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el alimento.');
      }

      const result = await response.json();
      console.log(result); 
      alert('Alimento eliminado correctamente.');
      window.location.reload(); 

    } catch (error) {
      console.error('Error al eliminar el alimento:', error);
      alert('Error al eliminar el alimento.');
    }

  };

  return (
    <div className='container-edit'>
      <form onSubmit={handleSubmit}>
        <div className='form_add'>
        <div className="exercise-info">
        <div className="exercise-info">
                  <div className="exercise-info-column">
                    <div className="exercise-info-row">
                      Peso: {food.peso} gramos
                    </div>
                    <div className="exercise-info-row">
                      Calorias totales: {food.calorias} kcal
                    </div>
                  </div>
                  <div className="exercise-info-column">
                    <div className="exercise-info-row">
                      Carbohidratos:{" "}
                      {food.macronutrientes.find(
                        (m) => m.macronutriente === "Carbohidratos"
                      )?.cantidad || 0}{" "}
                      kcal
                    </div>
                    <div className="exercise-info-row">
                      Proteína:{" "}
                      {food.macronutrientes.find(
                        (m) => m.macronutriente === "Proteinas"
                      )?.cantidad || 0}{" "}
                      kcal
                    </div>
                    <div className="exercise-info-row">
                      Grasa:{" "}
                      {food.macronutrientes.find(
                        (m) => m.macronutriente === "Grasas"
                      )?.cantidad || 0}{" "}
                      kcal
                    </div>
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