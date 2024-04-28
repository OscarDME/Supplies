import React, {useEffect, useState} from 'react'
import { RoutineCard } from '../DATA_NEW_ROUTINES'
import AssignRoutinesModify from './AssignRoutinesModify';
import SearchBar from '../SearchBar';
import { ToolTip } from '../ToolTip';
import config from "../../utils/conf";

export default function AssingRoutinesList({onRoutineUpdate, selectedUser}) {
  

    const [searchTerm, setSearchTerm] = useState('');
    const [updatedRoutine, setUpdatedRoutine] = useState(null);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [expandedDay, setExpandedDay] = useState(null);
    const [showUpdateRoutinePage, setUpdateRoutinePage] = useState(false);
    const [routines, setRoutines] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("all");

    const loadRoutines = async (filter) => {
      setSelectedFilter(filter);
      try {
          const response = await fetch(`${config.apiBaseUrl}/rutinacompleta`); // Asume que este es tu endpoint para obtener las rutinas
          if (response.ok) {
              const data = await response.json();
              setRoutines(data); // Actualiza el estado con las rutinas obtenidas
              console.log(data);
          } else {
              // Manejar posibles errores de respuesta
              console.error('Respuesta fallida al cargar las rutinas:', response.status);
          }
      } catch (error) {
          console.error('Error al cargar las rutinas:', error);
      }
  };
  
  useEffect(() => {
    loadRoutines();
    }, []); 


    useEffect(() => {
        setExpandedRow(null);
        setExpandedDay(null);
        setSelectedRoutine(null);
        setUpdatedRoutine(null);
        setUpdateRoutinePage(false);
        setSelectedFilter("all");
    }, [selectedUser]);


    const filteredExercises = routines.filter(routine => {
      return (
          (routine.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) 
      );
    });

      const getDifficultyClass = (difficulty) => {
        switch(difficulty) {
          case 'Baja':
            return 'row-easy';
          case 'Media':
            return 'row-medium';
          case 'Alta':
            return 'row-hard';
          default:
            return '';
        }
      };

      const handleRowClick = (routine) => {
        if (expandedRow === routine.ID_Rutina) {
          setExpandedRow(null);
          setExpandedDay(null);
          setSelectedRoutine(null); // Deselecciona la fila al hacer clic nuevamente
        } else {
          setExpandedDay(null);
          setExpandedRow(routine.ID_Rutina);
          setSelectedRoutine(routine); // Selecciona la fila al hacer clic
        }
      };

      const handleUpdateClick = (routine) => {
        setSelectedRoutine(routine); // Establecer selectedRoutine con la rutina seleccionada
        setUpdatedRoutine(routine); // Asignar routine a updatedRoutine
        setUpdateRoutinePage(true);
      };

      const handleDayClick = (day) => {
        setExpandedDay(expandedDay === day ? null : day);
      };

      const handleBackToList = () => {
        onRoutineUpdate(null);
        setExpandedRow(null);
        setExpandedDay(null);
        setSelectedRoutine(null);
        setUpdatedRoutine(null);
        setUpdateRoutinePage(false);
    };

    if (showUpdateRoutinePage) {
         return <AssignRoutinesModify onBackToList={handleBackToList} selectedUser={selectedUser} selectedRoutine={selectedRoutine} onRoutineUpdate={onRoutineUpdate} />;;
    }

    

    return (
        <div className="container2">
              <h2 className='MainTitle'>Lista de rutinas</h2>
        <div className="search-bar-container2">
    <div className='search-bar'>
      <div className='addclient'><i className="bi bi-search h4"></i></div>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </div>
    </div>
    <div className='btn-filter-container'>
    <button onClick={() => loadRoutines('all')} className={selectedFilter === 'all' ? 'selected-filter' : 'btn-filter-routine'}>Todas las rutinas</button>
    <button onClick={() => loadRoutines('recommended')} className={selectedFilter === 'recommended' ? 'selected-filter' : 'btn-filter-routine'}>Rutinas sugeridas para {selectedUser.nombre}</button>
    </div>
          <ul className='cardcontainer-colors2'>
            {filteredExercises.map((routine) => (
              <li key={routine.ID_Rutina} className={`row ${getDifficultyClass(routine.dificultad)} ${((selectedRoutine && selectedRoutine.ID_Rutina === routine.ID_Rutina)) ? 'selected' : ''}`}>
                      <div onClick={() => handleRowClick(routine)} className={`row_header ${((selectedRoutine && selectedRoutine.id === routine.id)) ? 'selected' : ''}`}>
                  <div>
                      <div className='row_name'>{routine.nombre}</div>
                      <div className='row_description'>{routine.dificultad}</div>
                      <div className='row_description'>{routine.diasEntreno.length} día(s) a la semana</div>
                  </div>
                      <div className="row_edit">
                      <button className='btn-select-routine' onClick={(e) => { e.stopPropagation(); handleUpdateClick(routine); }}>Elegir</button>
                      </div>
                </div>
                
                {expandedRow === routine.ID_Rutina && (
              <div className="routine-info">
                {routine.diasEntreno.map((day) => (
                  <div
                    key={day.ID_Dias_Entreno}
                    className={`routine-day-info ${
                      day.ID_Dias_Entreno % 2 === 0 ? "day-even" : "day-odd"
                    }`}
                  >
                    <div
                      className={`routine-day ${
                        expandedDay === day.ID_Dias_Entreno ? "selected" : ""
                      }`}
                      onClick={() => handleDayClick(day.ID_Dias_Entreno)}
                    >
                      <i
                        className={`bi ${
                          expandedDay === day.ID_Dias_Entreno
                            ? "bi-caret-down-fill"
                            : "bi-caret-right-fill"
                        } day-icon`}
                      ></i>
                      {day.NombreDia}
                    </div>
                    {expandedDay === day.ID_Dias_Entreno && (
                      <div className="day-block">
                        {day.ejercicios.map((exercise, exerciseIndex) => (
                          <div
                            key={exercise.ID_Ejercicio}
                            className="exercise-block"
                          >
                            <ul
                              className={`exercise-list ${
                                exerciseIndex % 2 === 0
                                  ? "exercise-even"
                                  : "exercise-odd"
                              }`}
                            >
                              <li className="exercise-row">
                                <div className="exercise-name">
                                  <h5>{exercise.ejercicio}</h5>
                                  {/* Asumiendo que ToolTip y la información de ejercicio a mostrar se ajustan a tus necesidades */}
                                  <ToolTip
                                    muscles={exercise.Musculo}
                                    difficulty={exercise.Dificultad}
                                    material={exercise.Equipo}
                                    type={exercise.Tipo_Ejercicio}
                                  >
                                    <i className="bi bi-info-circle-fill info-icon"></i>
                                  </ToolTip>
                                </div>
                                {/* Verificar si es un ejercicio cardiovascular */}
                                {exercise.Modalidad === "Cardiovascular" && (
                                  <>
                                    {exercise.bloqueSets.map((bloque) =>
                                      bloque.conjuntoSeries.map((conjunto) =>
                                        conjunto.series.map((serie) => {
                                          if (serie.tiempoEnMinutos) {
                                            return (
                                              <div>
                                                Tiempo: {serie.tiempoEnMinutos}{" "}
                                                minutos
                                              </div>
                                            );
                                          }
                                          return null;
                                        })
                                      )
                                    )}
                                  </>
                                )}

                                {/* Omitir la lógica para mostrar los sets y los drop sets si el ejercicio es cardiovascular */}
                                {exercise.Modalidad !== "Cardiovascular" && (
                                  <React.Fragment>
                                    {/* Iterar sobre los sets y los drop sets */}
                                    {exercise.bloqueSets.flatMap(
                                      (bloque, bloqueIndex) =>
                                        bloque.conjuntoSeries.flatMap(
                                          (conjunto, conjuntoIndex) =>
                                            conjunto.series.map(
                                              (serie, serieIndex) => {
                                                // Determinar si es un drop set basado en si tiene ID_SeriePrincipal
                                                const isDropSet =
                                                  !!serie.ID_SeriePrincipal;
                                                // Calcular el número de set, teniendo en cuenta si es un drop set
                                                const setNumber = isDropSet
                                                  ? `1`
                                                  : `${conjuntoIndex + 1}`;
                                                // Mostrar 'Drop-Set' para drop sets, 'Set' para sets normales
                                                const setText = isDropSet
                                                  ? `Drop-Set ${setNumber}`
                                                  : `Set ${setNumber}`;
                                                return (
                                                  <div
                                                    key={`${bloqueIndex}-${conjuntoIndex}-${serieIndex}`}
                                                    className="set-text"
                                                  >
                                                    {setText}:{" "}
                                                    {serie.repeticiones}{" "}
                                                    repeticiones{" "}
                                                    {serie.peso
                                                      ? `con ${serie.peso} kg`
                                                      : ""}
                                                  </div>
                                                );
                                              }
                                            )
                                        )
                                    )}
                                    <div className="superset-text">
                                      {exercise.superset ? "Sí" : "No"} hace
                                      superserie con el siguiente ejercicio.
                                    </div>
                                  </React.Fragment>
                                )}
                              </li>
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
              </li>
            ))}
          </ul>
        </div>
      );
}
