import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';
import config from "../../../utils/conf";

export default function  RequestFoodsAdd({ food }) {


  const updateFoodStatus = async (id) => {
    const url = `${config.apiBaseUrl}/estadoalimento/${id}`;
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Hubo un problema con la solicitud de actualización del estado del alimento.');
      }

      const result = await response.json();
      console.log(result); 
      alert('El estado del alimento ha sido actualizado correctamente.');
      window.location.reload(); 
    } catch (error) {
      console.error('Error al actualizar el estado del alimento:', error);
      alert('Error al actualizar el estado del alimento.');
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!food.nombre || !food.calorias || !food.categoria || !food.peso || !food.calorias) { 
      alert('El alimento no cuenta con todos los campos necesarios para ser agregado a la base de datos.');
      return;
    }
    updateFoodStatus(food.ID_Alimento);

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
        <button className='add_button'>Guardar en la base de datos</button>
        </div>
      </form>
    </div>
  );
}