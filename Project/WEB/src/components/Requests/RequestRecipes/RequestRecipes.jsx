import React, { useState, useEffect } from 'react';
import { RecipeCard } from "../../DATA_RECIPES";
import '../../../styles/Management.css';
import RequestRecipesEdit from './RequestRecipesEdit';
import RequestRecipesAdd from './RequestRecipesAdd';
import RequestRecipesDelete from './RequestRecipesDelete';
import config from "../../../utils/conf";

export default function RequestRecipes() {
    const [searchTerm, setSearchTerm] = useState('');
    const [recipes, setRecipes] = useState([]); // Nuevo estado para las recetas
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [addRecipe, setAddRecipe] = useState(null);
    const [deleteRecipe, setDeleteRecipe] = useState(null);
  
    const loadRecipes = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/recetarequest`); // Ajusta la URL según tu configuración de backend
        const data = await response.json();
        setRecipes(data); // Actualizar el estado con las recetas obtenidas
        console.log(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
  
    useEffect(() => {
      loadRecipes();
    }, []); // Cargar recetas al montar el componente
  
    const filteredRecipes = recipes.filter((recipe) =>
      recipe.receta.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleRowClick = (recipe) => {
      if (expandedRow === recipe.ID_Receta) {
        setExpandedRow(null);
        setEditingRecipe(null);
        setAddRecipe(null);
        setDeleteRecipe(null);
        setSelectedRecipe(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        if (editingRecipe && editingRecipe.ID_Receta === editingRecipe.ID_Receta) {
            setEditingRecipe(null); // Si el formulario de edición está abierto, ciérralo
            setAddRecipe(null);
            setDeleteRecipe(null);
        }
        setEditingRecipe(null);
        setDeleteRecipe(null);
        setAddRecipe(null);
        setExpandedRow(recipe.ID_Receta);
        setSelectedRecipe(recipe); // Selecciona la fila al hacer clic
      }
    };
    
    const handleEditClick = (recipe) => {
      if (editingRecipe && editingRecipe.ID_Receta === recipe.ID_Receta) {
        setEditingRecipe(null); // Si la receta está seleccionada, oculta el formulario de edición
      } else {
        if (expandedRow && expandedRow !== recipe.ID_Receta) {
          setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
          setSelectedRecipe(null);
          setAddRecipe(null);
          setDeleteRecipe(null);
          setEditingRecipe(null);
        }
        setExpandedRow(null);
        setSelectedRecipe(null);
        setAddRecipe(null);
        setDeleteRecipe(null);
        setEditingRecipe(recipe); // Muestra el formulario de edición para el recetas seleccionado
      }
    };

    const handleAddClick = (recipe) => {
      if (addRecipe && addRecipe.ID_Receta === recipe.ID_Receta) {
        setAddRecipe(null); // Si la receta está seleccionada, oculta el formulario de edición
      } else {
        if (expandedRow && expandedRow !== recipe.ID_Receta) {
          setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
          setSelectedRecipe(null);
          setDeleteRecipe(null);
          setEditingRecipe(null);
          setAddRecipe(null);
        }
        setExpandedRow(null);
        setSelectedRecipe(null);
        setDeleteRecipe(null);
        setEditingRecipe(null);
        setAddRecipe(recipe); // Muestra el formulario de edición para el recetas seleccionado
      }
    };
    

    const handleDeleteClick = (recipe) => {
      if (deleteRecipe && deleteRecipe.ID_Receta === recipe.ID_Receta) {
        setDeleteRecipe(null); // Si la receta está seleccionada, oculta el formulario de edición
      } else {
        if (expandedRow && expandedRow !== recipe.ID_Receta) {
          setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
          setSelectedRecipe(null);
          setAddRecipe(null);
          setDeleteRecipe(null);
          setEditingRecipe(null);
        }
        setExpandedRow(null);
        setSelectedRecipe(null);
        setAddRecipe(null);
        setEditingRecipe(null);
        setDeleteRecipe(recipe); // Muestra el formulario de edición para el recetas seleccionado
      }
    };
    
    
    return (
      <div className="container2">
          <ul className='cardcontainer'>
            {filteredRecipes.map((recipe) => (
              <li key={recipe.ID_Receta} className={`row ${((selectedRecipe && selectedRecipe.ID_Receta === recipe.ID_Receta) || (editingRecipe && editingRecipe.ID_Receta === recipe.ID_Receta )  || (addRecipe && addRecipe.ID_Receta === recipe.ID_Receta ) || (deleteRecipe && deleteRecipe.ID_Receta === recipe.ID_Receta )) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(recipe)} className={`row_header ${((selectedRecipe && selectedRecipe.ID_Receta === recipe.ID_Receta) || (editingRecipe && editingRecipe.ID_Receta === recipe.ID_Receta )  || (addRecipe && addRecipe.ID_Receta === recipe.ID_Receta ) || (deleteRecipe && deleteRecipe.ID_Receta === recipe.ID_Receta )) ? 'selected' : ''}`}>
                  <div>
                    <div className='row_name'>{recipe.receta}</div>
                    <div className='row_description'>{recipe.clasificaciones.join(" - ")}</div>
                  </div>
                  <div className="row_buttons">
                    <div className="row_edit">
                      <i className={`bi bi-database-add card-icon ${addRecipe && addRecipe.ID_Receta === recipe.ID_Receta ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleAddClick(recipe); }}></i>
                    </div>
                    <div className="row_edit">
                        <i className={`bi bi-trash card-icon ${deleteRecipe && deleteRecipe.ID_Receta === recipe.ID_Receta ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleDeleteClick(recipe); }}></i>
                    </div>
                    <div className="row_edit">
                      <i className={`bi bi-pencil-square card-icon ${editingRecipe && editingRecipe.ID_Receta === recipe.ID_Receta ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleEditClick(recipe); }}></i>
                    </div>
                  </div>
                </div>
                {expandedRow === recipe.ID_Receta && (
                  <>
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
                  </>
                )}
                {addRecipe && addRecipe.ID_Receta === recipe.ID_Receta && (
                  <>
                    <RequestRecipesAdd recipe={addRecipe} />
                  </>
                )}
                {deleteRecipe && deleteRecipe.ID_Receta === recipe.ID_Receta && (
                  <>
                    <RequestRecipesDelete recipe={deleteRecipe} />
                  </>
                )}
                {editingRecipe && editingRecipe.ID_Receta === recipe.ID_Receta && (
                  <>
                    <RequestRecipesEdit recipe={editingRecipe} />
                  </>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}
