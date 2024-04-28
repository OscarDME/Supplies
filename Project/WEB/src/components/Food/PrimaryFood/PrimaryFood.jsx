import React, { useState, useEffect } from 'react';
import { FoodCard } from "../../DATA_FOOD";
import SearchBar from '../../SearchBar';
import '../../../styles/Management.css';
import config from "../../../utils/conf";
import PrimaryFoodAdd from './PrimaryFoodAdd';


export default function PrimaryFood() {
  const [searchTerm, setSearchTerm] = useState('');
  const [foods, setFoods] = useState([]); // Almacena los alimentos obtenidos de la API
  const [selectedFood, setSelectedFood] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingFood, setEditingFood] = useState(null);
  const [showAddPage, setShowAddPage] = useState(false);

  useEffect(() => {
      // Función para cargar los alimentos desde la API
      const fetchFoods = async () => {
          try {
              const response = await fetch(`${config.apiBaseUrl}/alimentos`); // Ajusta esta URL a tu endpoint específico
              if (!response.ok) throw new Error('No se pudieron obtener los alimentos');
              const data = await response.json();
              setFoods(data); // Almacena los alimentos en el estado
              console.log(data);
          } catch (error) {
              console.error("Error al obtener los alimentos:", error);
          }
      };

      fetchFoods(); // Llama a la función al montar el componente
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar

  
  const filteredFoods = foods.filter(food =>
    food.nombre.toLowerCase().includes(searchTerm.toLowerCase())
);

// Las funciones handleRowClick, handleEditClick, etc., se mantienen iguales

    const handleRowClick = (food) => {
      if (expandedRow === food.ID_Alimento) {
        setExpandedRow(null);
        setEditingFood(null);
        setSelectedFood(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        if (editingFood && editingFood.ID_Alimento === food.ID_Alimento) {
            setEditingFood(null); // Si el formulario de edición está abierto, ciérralo
        }
        setEditingFood(null);
        setExpandedRow(food.ID_Alimento);
        setSelectedFood(food); // Selecciona la fila al hacer clic
      }
    };
    
    const handleAddClick = () => {
      setShowAddPage(true); // Actualiza el estado para mostrar el nuevo componente al hacer clic en el icono de agregar
    };

    const handleBackToList = () => {
        setShowAddPage(false); // Volver a la lista de comidas
    };
    
    // Si showAddPage es verdadero, renderiza el componente de agregar ejercicio
    if (showAddPage) {
      return <PrimaryFoodAdd onBackToList={handleBackToList} />;
  }

    return (
      <div className="container">
          <div className="search-bar-container">
            <div className='search-bar'>
              <div className='addclient'><i className="bi bi-search h4"></i></div>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            <div>
              <a className="iconadd" role="button" onClick={handleAddClick}><i className="bi bi-plus-circle-fill"></i></a>
            </div>
          </div>
          <ul className='cardcontainer'>
            {filteredFoods.map((food) => (
              <li key={food.ID_Alimento} className={`row ${((selectedFood && selectedFood.ID_Alimento === food.ID_Alimento) || (editingFood && editingFood.ID_Alimento === food.ID_Alimento)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(food)} className={`row_header ${((selectedFood && selectedFood.ID_Alimento === food.ID_Alimento) || (editingFood && editingFood.ID_Alimento === food.ID_Alimento)) ? 'selected' : ''}`}>
                  <div>
                    <div className='row_name'>{food.nombre}</div>
                    <div className='row_description'>{food.categoria}</div>
                  </div>
                </div>
                {expandedRow === food.ID_Alimento && (
                  <>
                    <div className="exercise-info">
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Peso: {food.peso} gramos</div>
                        <div className="exercise-info-row">Calorias totales: {food.calorias} kcal</div>
                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Carbohidratos: {food.macronutrientes.find(m => m.macronutriente === 'Carbohidratos')?.cantidad || 0} kcal</div>
                        <div className="exercise-info-row">Proteína: {food.macronutrientes.find(m => m.macronutriente === 'Proteinas')?.cantidad || 0} kcal</div>
                        <div className="exercise-info-row">Grasa: {food.macronutrientes.find(m => m.macronutriente === 'Grasas')?.cantidad || 0} kcal</div>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}
