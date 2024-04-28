import React, { useState, useEffect } from 'react';
import { ExerciseCard } from "../../DATA_EXERCISES";
import SearchBar from '../../SearchBar';
import '../../../styles/Management.css';
import RequestExercisesEdit from './RequestExercisesEdit';
import RequestExercisesAdd from './RequestExercisesAdd';
import RequestExercisesDelete from './RequestExercisesDelete';
import config from "../../../utils/conf";

export default function RequestExercises() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [addingExercise, setAddingExercise] = useState(null);
    const [eliminatingExercise, setEliminatingExercise] = useState(null);
    const [editingExercise, setEditingExercise] = useState(null);
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
      const loadExercises = async () => {
          try {
              const response = await fetch(`${config.apiBaseUrl}/exerciserequest`);
              if (!response.ok) {
                  throw new Error('No se pudieron obtener los ejercicios');
              }
              const data = await response.json();
              console.log(data);
              setExercises(data);
          } catch (error) {
              console.error("Error al obtener los ejercicios:", error);
          }
      };

      loadExercises();
  }, []); 
  
  const filteredExercises = exercises.filter(exercise =>
    exercise.ejercicio.toLowerCase().includes(searchTerm.toLowerCase())
);

    const handleRowClick = (exercise) => {
      if (expandedRow === exercise.ID_Ejercicio) {
        setExpandedRow(null);
        setEditingExercise(null);
        setAddingExercise(null);
        setEliminatingExercise(null);
        setSelectedExercise(null);
      } else {
        if (editingExercise && editingExercise.ID_Ejercicio === exercise.ID_Ejercicio) {
          setEditingExercise(null);
          setAddingExercise(null);
          setEliminatingExercise(null);
        }
        setEditingExercise(null);
        setAddingExercise(null);
        setEliminatingExercise(null);
        setExpandedRow(exercise.ID_Ejercicio);
        setSelectedExercise(exercise);
      }
    };
    
    const handleEditClick = (exercise) => {
      if (editingExercise && editingExercise.ID_Ejercicio === exercise.ID_Ejercicio) {
        setEditingExercise(null);
      } else {
        if (expandedRow && expandedRow !== exercise.ID_Ejercicio) {
          setExpandedRow(null);
          setSelectedExercise(null);
          setEliminatingExercise(null);
          setAddingExercise(null);
        }
        setExpandedRow(null);
        setSelectedExercise(null);
        setEliminatingExercise(null);
        setAddingExercise(null);
        setEditingExercise(exercise);
      }
    };

    const handleAddClick = (exercise) => {
      if (addingExercise && addingExercise.ID_Ejercicio === exercise.ID_Ejercicio) {
        setAddingExercise(null);
      } else {
        if (expandedRow && expandedRow !== exercise.ID_Ejercicio) {
          setExpandedRow(null);
          setSelectedExercise(null);
          setEliminatingExercise(null);
          setEditingExercise(null);
        }
        setExpandedRow(null);
        setSelectedExercise(null);
        setEliminatingExercise(null);
        setEditingExercise(null);
        setAddingExercise(exercise);
      }
    };

    const handleDeleteClick = (exercise) => {
      if (eliminatingExercise && eliminatingExercise.ID_Ejercicio === exercise.ID_Ejercicio) {
        setEliminatingExercise(null);
      } else {
        if (expandedRow && expandedRow !== exercise.ID_Ejercicio) {
          setExpandedRow(null);
          setSelectedExercise(null);
          setEditingExercise(null);
          setAddingExercise(null);
        }
        setExpandedRow(null);
        setSelectedExercise(null);
        setEditingExercise(null);
        setAddingExercise(null); 
        setEliminatingExercise(exercise); 
      }
    };
    
    return (
      <div className="container2">
          <ul className='cardcontainer'>
            {filteredExercises.map((exercise) => (
              <li key={exercise.ID_Ejercicio} className={`row ${((selectedExercise && selectedExercise.ID_Ejercicio === exercise.ID_Ejercicio) || (editingExercise && editingExercise.ID_Ejercicio === exercise.ID_Ejercicio) || (addingExercise && addingExercise.ID_Ejercicio === exercise.ID_Ejercicio) || (eliminatingExercise && eliminatingExercise.ID_Ejercicio === exercise.ID_Ejercicio)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(exercise)} className={`row_header ${((selectedExercise && selectedExercise.ID_Ejercicio === exercise.ID_Ejercicio) || (editingExercise && editingExercise.ID_Ejercicio === exercise.ID_Ejercicio) || (addingExercise && addingExercise.ID_Ejercicio === exercise.ID_Ejercicio) || (eliminatingExercise && eliminatingExercise.ID_Ejercicio === exercise.ID_Ejercicio)) ? 'selected' : ''}`}>
                  <div>
                    <div className='row_name'>{exercise.ejercicio}</div>
                    <div className='row_description'>{exercise.Musculo}</div>
                  </div>
                  <div className="row_buttons">
                    <div className="row_edit">
                      <i className={`bi bi-database-add card-icon ${addingExercise && addingExercise.ID_Ejercicio === exercise.ID_Ejercicio ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleAddClick(exercise); }}></i>
                    </div>
                    <div className="row_edit">
                        <i className={`bi bi-trash card-icon ${eliminatingExercise && eliminatingExercise.ID_Ejercicio === exercise.ID_Ejercicio ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleDeleteClick(exercise); }}></i>
                    </div>
                    <div className="row_edit">
                      <i className={`bi bi-pencil-square card-icon ${editingExercise && editingExercise.ID_Ejercicio === exercise.ID_Ejercicio ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleEditClick(exercise); }}></i>
                    </div>
                </div>
                </div>
                {expandedRow === exercise.ID_Ejercicio && (
                  <>
                    <div className="exercise-info">
                    <div className="exercise-info">
                      <div className="exercise-info-column">
                      <div className="exercise-info-row">Dificultad: {exercise.Dificultad}</div>
                        <div className="exercise-info-row">Equipo Necesario: {exercise.Equipo}</div>
                        <div className="exercise-info-row">Tipo de ejercicio: {exercise.Tipo_Ejercicio}</div>
                        <div className="exercise-info-row">Modalidad: {exercise.Modalidad}</div>
                        <div className='row_description'>
                        Músculos Secundarios: {exercise.musculosSecundarios.map(ms => ms.descripcion).join(", ")}
                        </div>    
                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Posición inicial: {exercise.preparacion}</div>
                        <div className="exercise-info-row">Ejecucion: {exercise.ejecucion}</div>
                        </div>
                    </div>
                    </div>
                  </>
                )}
                {addingExercise && addingExercise.ID_Ejercicio === exercise.ID_Ejercicio &&(
                  <RequestExercisesAdd exercise={addingExercise}/>
                )}
                {eliminatingExercise && eliminatingExercise.ID_Ejercicio === exercise.ID_Ejercicio &&(
                  <RequestExercisesDelete exercise={eliminatingExercise}/>
                )}
                {editingExercise && editingExercise.ID_Ejercicio === exercise.ID_Ejercicio && (
                  <>
                    <RequestExercisesEdit exercise={editingExercise} />
                  </>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}
