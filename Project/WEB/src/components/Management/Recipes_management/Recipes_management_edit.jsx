import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';
import CheckboxList from '../../CheckBoxCollectionsInputs';
import config from "../../../utils/conf";

export default function Recipes_management_edit({recipe}) {
  const [initialPortions, setInitialPortions] = useState({}); // Nuevo estado para initialPortions
  const [name, setRecipeName] = useState(recipe.name || '');
  const [preparation, setRecipePreparation] = useState(recipe.preparation || '');
  const [link, setRecipeLink] = useState(recipe.link || '');
  const [ingredients, setRecipeIngredients] = useState(recipe.ingredients || []);
  const [foodOptions, setFoodOptions] = useState([]); // Estado para almacenar las opciones de alimentos obtenidas desde la API

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/alimentos`);
        if (!response.ok) throw new Error('No se pudieron obtener los alimentos');
        const data = await response.json();
        const options = data.map(food => ({ label: food.nombre, value: food.ID_Alimento }));
        setFoodOptions(options);
      } catch (error) {
        console.error("Error al obtener los alimentos:", error);
      }
    };
    fetchFoods();
  }, []);

  useEffect(() => {
    if (!recipe || !recipe.ID_Receta) return;
    
    const fetchIngredientes = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/ingredientes/${recipe.ID_Receta}`);
        if (!response.ok) throw new Error('No se pudieron obtener los ingredientes');
        const ingredientesReceta = await response.json();
  
        // Convertir ingredientesReceta a un objeto de porciones donde cada clave es ID_Alimento
        const initialPortions = ingredientesReceta.reduce((acc, current) => {
          acc[current.ID_Alimento] = current.porcion.toString(); // Convierte porción a string si necesario
          return acc;
        }, {});
        setInitialPortions(initialPortions);
        // Pasar initialPortions a CheckboxList
        // Asegúrate de que CheckboxList recibe initialPortions como prop
      } catch (error) {
        console.error("Error al obtener ingredientes:", error);
      }
    };
  
    fetchIngredientes();
  }, [recipe, foodOptions]);
  

useEffect(() => {
  if (recipe) {
    setRecipeName(recipe.receta || '');
    setRecipePreparation(recipe.preparacion || '');
    setRecipeLink(recipe.link || '');
  }
}, [recipe]);

const handleRecipeNameChange = (event) => setRecipeName(event.target.value);

const handleRecipePreparationChange= (event) => setRecipePreparation(event.target.value);

const handleRecipeLinkChange = (event) => setRecipeLink(event.target.value);

const handleRecipeIngredientChange = (updatedIngredients) => {
  setRecipeIngredients(updatedIngredients);
};

const handleSubmit = async (event) => {
  event.preventDefault();

 // Expresión regular para validar el nombre y la preparación
 const regex = /^[\p{L}\p{N} _.,'"-]+$/u;

 // Expresión regular para validar el link
 const urlRegex = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/;

 // Validación del nombre de la receta
 if (name.length > 50 || !regex.test(name)) {
   alert('El nombre de la receta contiene caracteres no permitidos o es demasiado largo. Debe tener 50 caracteres o menos y solo puede contener letras, números, espacios, guiones, guiones bajos, puntos y comas.');
   return;
 }

 // Validación de la preparación
 if (preparation.length > 500 || !regex.test(preparation)) {
   alert('La preparación de la receta contiene caracteres no permitidos o es demasiado larga. Debe tener 500 caracteres o menos y solo puede contener letras, números, espacios, guiones, guiones bajos, puntos y comas.');
   return;
 }

 // Validación del link
 if (link && !urlRegex.test(link)) {
   alert('El link proporcionado no es un URL válido. Por favor, verifica el formato.');
   return;
 }

 const everyIngredientHasPortion = ingredients.every(ingredient => ingredient.porcion > 0);
  
 if (!name || !preparation || !everyIngredientHasPortion || (link && !urlRegex.test(link))) {
   alert('Por favor completa todos los campos requeridos y asegúrate de que cada ingrediente tenga una porción especificada.');
   return;
 }

  // Preparar el cuerpo de la solicitud con los datos del formulario
  const recetaData = {
    ID_Receta: recipe.ID_Receta, // Asegúrate de tener el ID de la receta que vas a actualizar
    receta: name,
    calorias: 0, // Asegúrate de manejar este valor según tu lógica de negocio
    preparacion: preparation,
    link: link,
    ingredientes: ingredients.map(ing => ({ ID_Alimento: ing.ID_Alimento, porcion: parseFloat(ing.porcion) })),
  };
  console.log(recetaData);

  try {
    const response = await fetch(`${config.apiBaseUrl}/recetas/${recipe.ID_Receta}`, {
      method: 'PUT', // o 'POST', dependiendo de tu configuración de backend
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recetaData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la receta');
    }

    const result = await response.json();
    console.log(result);
    alert('Receta actualizada con éxito');
    window.location.reload();

    // Opcional: Redirigir al usuario o actualizar el estado de la aplicación según sea necesario
  } catch (error) {
    console.error("Error al actualizar la receta:", error);
    alert('Error al actualizar la receta');
  }
};

return (
  <div className='container-edit'>
    <form className='form_add_exercise' onSubmit={handleSubmit}>
      <div className='add_exercise_area'>
        <div>
          <div className='add_exercise_rows'>
            ¿Cuál es el nombre de la receta? 
            <input type="text" className='add_exercise_input' value={name} onChange={handleRecipeNameChange}  />
          </div>
          <div className='add_exercise_rows'>
            ¿Cuál es la preparación del ejercicio? 
            <textarea className='add_exercise_textarea' value={preparation} onChange={handleRecipePreparationChange}  />
          </div>
          <div className='add_exercise_rows'>
            ¿Tiene algún link de preparación? 
            <input type="text" className='add_exercise_input' value={link} onChange={handleRecipeLinkChange}  />
          </div>
        </div>
        <div>
          <div className='add_exercise_rows'>
            ¿Qué alimentos necesita la receta?
            <CheckboxList options={foodOptions} selectedOptions={ingredients} onChange={handleRecipeIngredientChange}  idPrefix="food" initialPortions={initialPortions}/>
          </div>
        </div>
      </div>
      <button type="submit" className='add_button'>Guardar</button>
    </form>
  </div>
);
}