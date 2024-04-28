import React, { useState, useEffect} from 'react';
import '../../../styles/Management.css';
import { FoodCard } from "../../DATA_FOOD";
import CheckboxList from '../../CheckBoxCollectionsInputs';
import config from "../../../utils/conf";

export default function Recipes_management_add({ onBackToList }) {

  const [name, setRecipeName] = useState('');
  const [preparation, setRecipePreparation] = useState('');
  const [link, setRecipeLink] = useState('');
  const [ingredients, setRecipeIngredients] = useState([]);
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


  const handleRecipeNameChange = (event) => setRecipeName(event.target.value);
  const handleRecipePreparationChange = (event) => setRecipePreparation(event.target.value);
  const handleRecipeLinkChange = (event) => setRecipeLink(event.target.value);
  const handleRecipeIngredientChange = (updatedIngredients) => {
    setRecipeIngredients(updatedIngredients);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
  

    const regex = /^[\p{L}\p{N} _.,'"-]+$/u;

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
  
    const recetaData = {
      receta: name,
      preparacion: preparation,
      link: link,
      calorias: 0, // Define cómo calcular las calorías si es necesario
      ID_Clasificacion: 1, // Debe ser determinado por algún input o selección del usuario
      ingredientes: ingredients, // Debe estar en la forma [{ID_Alimento, porcion}, ...]
      macronutrientes: [] // Si necesitas incluir esto
    };

    console.log(recetaData);
  
    try {
      const response = await fetch(`${config.apiBaseUrl}/recetas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recetaData),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear la receta');
      }
  
      const result = await response.json();
      console.log(result);
      alert('Receta agregada con éxito.');
      onBackToList();
    } catch (error) {
      console.error('Error al guardar la receta:', error);
      alert('Error al guardar la receta.');
    }
  };

  return (
<div className='container'>
      <div className='add_header'>
        <button className="back_icon card-icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i> </button>
        <h1 className='mtitle'>Añadir una receta nueva</h1>
      </div>
      <form className='form_add_exercise' onSubmit={handleSubmit}>
        <div className='add_exercise_area'>
        <div>
          <div className='add_exercise_rows'>
            ¿Cuál es el nombre de la receta? 
            <input type="text" className='add_exercise_input' value={name} onChange={handleRecipeNameChange}  />
          </div>
          <div className='add_exercise_rows'>
            ¿Cuál es la preparación de la receta? 
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
            <CheckboxList options={foodOptions} selectedOptions={ingredients} onChange={handleRecipeIngredientChange}  idPrefix="food"/>
          </div>
        </div>
      </div>
        <button className='add_button'>Agregar receta</button>
      </form>
    </div>
  )
}





