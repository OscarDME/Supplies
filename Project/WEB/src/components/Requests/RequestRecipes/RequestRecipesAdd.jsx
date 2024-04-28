import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';
import config from "../../../utils/conf";

export default function  RequestRecipesAdd({ recipe }) {
  // if (!recipe.name || recipe.ingredients.length === 0 || !recipe.preparation) { 
    //   alert('El alimento no cuenta con todos los campos necesarios para ser agregado a la base de datos.');
    //   return;
    // }

    const handleSubmit = async (event) => {
      event.preventDefault();
    
      try {
        const url = `${config.apiBaseUrl}/estadoreceta/${recipe.ID_Receta}`;
        
        const response = await fetch(url, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Error al actualizar el estado de la receta');
        }
  
        const result = await response.json();
        console.log(result); 
        alert('El estado de la receta ha sido actualizado correctamente.');
        window.location.reload(); 
      } catch (error) {
        console.error('Error al actualizar el estado de la receta:', error);
        alert('Error al actualizar el estado de la receta.');
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
        <button className='add_button'>Guardar en la base de datos</button>
        </div>
      </form>
    </div>
  );
}