import React, { useState, useEffect } from 'react';
import { ExerciseCard } from "../../DATA_EXERCISES";
import SearchBar from '../../SearchBar';
import '../../../styles/Management.css';
import Exercises_management_add from './Exercises_management_add';
import Exercises_management_edit from './Exercises_management_edit';
import config from "../../../utils/conf";

export default function Exercises_management_list() {
    const [searchTerm, setSearchTerm] = useState('');
    const [exercises, setExercises] = useState([]); // Cambiado para almacenar los ejercicios desde el backend
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [editingExercise, setEditingExercise] = useState(null);
    const [showAddPage, setShowAddPage] = useState(false); // Estado para controlar la visibilidad del nuevo componente

    useEffect(() => {
      // Función para cargar los ejercicios desde el backend
      const loadExercises = async () => {
          try {
              const response = await fetch(`${config.apiBaseUrl}/ejercicio`);
              if (!response.ok) {
                  throw new Error('No se pudieron obtener los ejercicios');
              }
              const data = await response.json();
              console.log(data);
              setExercises(data); // Almacena los ejercicios en el estado
          } catch (error) {
              console.error("Error al obtener los ejercicios:", error);
          }
      };

      loadExercises();
  }, []); 
    // Filtrado de ejercicios basado en la búsqueda
    const filteredExercises = exercises.filter(exercise =>
      exercise.ejercicio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
    const handleRowClick = (exercise) => {
      if (expandedRow === exercise.ID_Ejercicio) {
        setExpandedRow(null);
        setEditingExercise(null);
        setSelectedExercise(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        if (editingExercise && editingExercise.ID_Ejercicio === exercise.ID_Ejercicio) {
          setEditingExercise(null); // Si el formulario de edición está abierto, ciérralo
        }
        setEditingExercise(null);
        setExpandedRow(exercise.ID_Ejercicio);
        setSelectedExercise(exercise); // Selecciona la fila al hacer clic
      }
    };
    
    const handleEditClick = (exercise) => {
      if (editingExercise && editingExercise.ID_Ejercicio === exercise.ID_Ejercicio) {
        setEditingExercise(null); // Si el mismo ejercicio está seleccionado, oculta el formulario de edición
      } else {
        if (expandedRow && expandedRow !== exercise.ID_Ejercicio) {
          setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
          setSelectedExercise(null);
        }
        setExpandedRow(null);
        setSelectedExercise(null);
        setEditingExercise(exercise); // Muestra el formulario de edición para el ejercicio seleccionado
      }
    };

    const handleAddClick = () => {
      setShowAddPage(true); // Actualiza el estado para mostrar el nuevo componente al hacer clic en el icono de agregar
    };

    const handleBackToList = () => {
        setShowAddPage(false); // Volver a la lista de ejercicios
    };
    
    // Si showAddPage es verdadero, renderiza el componente de agregar ejercicio
    if (showAddPage) {
        return <Exercises_management_add onBackToList={handleBackToList} />;
    }
    
    const ES_CARDIOVASCULAR = "Cardiovascular";

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
          {filteredExercises.map((exercise) => (
              <li key={exercise.ID_Ejercicio} className={`row ${((selectedExercise && selectedExercise.ID_Ejercicio === exercise.ID_Ejercicio) || (editingExercise && editingExercise.ID_Ejercicio === exercise.ID_Ejercicio)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(exercise)} className={`row_header ${((selectedExercise && selectedExercise.id === exercise.ID_Ejercicio) || (editingExercise && editingExercise.ID_Ejercicio === exercise.ID_Ejercicio)) ? 'selected' : ''}`}>
                  <div>
                    <div className='row_name'>{exercise.ejercicio}</div>
                    <div className='row_description'>
                    {exercise.Modalidad === ES_CARDIOVASCULAR ? exercise.Modalidad : exercise.Musculo}
                  </div>
                  </div>
                  <div className="row_edit">
                      <i className={`bi bi-pencil-square card-icon ${editingExercise && editingExercise.ID_Ejercicio === exercise.ID_Ejercicio ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleEditClick(exercise); }}></i>
                    </div>
                </div>
                {expandedRow === exercise.ID_Ejercicio && (
                <>
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
                          Músculos Secundarios: {exercise.musculosSecundarios && exercise.musculosSecundarios.length > 0 
                            ? exercise.musculosSecundarios.map(ms => ms.descripcion).join(", ") 
                            : "Ninguno"}
                        </div>    
                      )}
                    </div>
                    <div className="exercise-info-column">
                      <div className="exercise-info-row">Posición inicial: {exercise.preparacion}</div>
                      <div className="exercise-info-row">Ejecución: {exercise.ejecucion}</div>
                    </div>
                  </div>
                </>
              )}
                {editingExercise && editingExercise.ID_Ejercicio === exercise.ID_Ejercicio && (
                  <>
                    <Exercises_management_edit exercise={editingExercise} />
                  </>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}
