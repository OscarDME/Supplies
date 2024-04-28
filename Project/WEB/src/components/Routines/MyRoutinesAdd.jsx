import React, { useState, useEffect } from "react";
import "../../styles/Management.css";
import NumberInput from "../NumberInput";
import Dropdown from "../DropdownCollections";
import Switch from "@mui/material/Switch";
import { ToolTipInfo } from "../ToolTipInfo";
import config from "../../utils/conf";
import { useMsal } from "@azure/msal-react";

export default function MyRoutinesAdd({ onBackToList }) {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const days = [
    { label: "Lunes", value: 1 },
    { label: "Martes", value: 2 },
    { label: "Miercoles", value: 3 },
    { label: "Jueves", value: 4 },
    { label: "Viernes", value: 5 },
    { label: "Sabado", value: 6 },
    { label: "Domingo", value: 7 },
  ];
  const [routineName, setRoutineName] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState(1);
  const initialState = Array.from({ length: daysPerWeek }, () => []);
  const [selectedDays, setSelectedDays] = useState(Array(daysPerWeek).fill(""));

  const [exercises, setExercises] = useState([initialState]); // Nuevo estado para almacenar la lista de ejercicios
  const [exerciseList, setExerciseList] = useState([]);

  useEffect(() => {
    // Función para cargar ejercicios desde la API
    const loadExercises = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/ejercicio`); // Ajusta la URL según tu API
        if (!response.ok)
          throw new Error("Respuesta no satisfactoria de la API");
        const data = await response.json();
        console.log(data);
        setExerciseList(
          data.map((exercise) => ({
            value: exercise.ID_Ejercicio,
            label: exercise.ejercicio,
            type: exercise.Modalidad, 
          }))
        );
      } catch (error) {
        console.error("Error al cargar ejercicios:", error);
        // Manejar el error (mostrar un mensaje al usuario, por ejemplo)
      }
    };

    loadExercises();
  }, []);

  useEffect(() => {
    setSelectedDays((prev) => {
      const newSize = Array(daysPerWeek).fill("");
      return prev.length < daysPerWeek
        ? [...prev, ...newSize.slice(prev.length)]
        : prev.slice(0, daysPerWeek);
    });

    setExercises((prev) => {
      const newSize = Array.from({ length: daysPerWeek }, () => []);
      return prev.length < daysPerWeek
        ? [...prev, ...newSize.slice(prev.length)]
        : prev.slice(0, daysPerWeek);
    });
  }, [daysPerWeek]);

  const handleRoutineNameChange = (event) => setRoutineName(event.target.value);

  const addExercise = (dayIndex, type) => {
    let newSet = { time: null, reps: null, weight: null };

    let newExercise = {
      sets: [[newSet]],
      rest: null,
      isSuperset: false,
    };

    setExercises((exercises) =>
      exercises.map((day, index) =>
        index === dayIndex ? [...day, newExercise] : day
      )
    );
  };

  const saveRoutine = async () => {
    try {
      const response = await fetch("/api/rutinas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          routineName,
          days: exercises.map((day) => ({
            selectedDay: day.selectedDay,
            exercises: day.exercises.map((exercise) => ({
              name: exercise.name,
              sets: exercise.sets,
              // incluir más detalles según sea necesario
            })),
          })),
        }),
      });

      if (response.ok) {
        // Manejo de éxito
        alert("Rutina guardada con éxito");
        onBackToList(); // Redirige o actualiza la vista según sea necesario
      } else {
        // Manejo de errores del servidor
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      // Manejo de errores de red/conexión
      alert("Error al guardar la rutina");
    }
  };

  const addDropSetToSet = (dayIndex, exerciseIndex, setIndex, newSet) => {
    setExercises((currentExercises) => {
      return currentExercises.map((day, dIndex) => {
        if (dIndex === dayIndex) {
          return day.map((exercise, eIndex) => {
            if (eIndex === exerciseIndex) {
              let updatedSets = [...exercise.sets];
              const updatedSetGroup = updatedSets.map(
                (setGroup, groupIndex) => {
                  if (groupIndex === setIndex) {
                    return [...setGroup, { ...newSet, isDropSet: true }]; // Marca el nuevo set como dropset
                  }
                  return setGroup;
                }
              );
              return { ...exercise, sets: updatedSetGroup };
            }
            return exercise;
          });
        }
        return day;
      });
    });
  };

  const addSetToExercise = (dayIndex, exerciseIndex, newSet) => {
    setExercises((currentExercises) => {
      return currentExercises.map((day, dIndex) => {
        if (dIndex === dayIndex) {
          return day.map((exercise, eIndex) => {
            if (eIndex === exerciseIndex) {
              const updatedSets = [...exercise.sets, [newSet]];
              return { ...exercise, sets: updatedSets };
            }
            return exercise;
          });
        }
        return day;
      });
    });
  };

  function generateDayContainers(daysCount) {
    let containers = [];
    for (let i = 0; i < daysCount; i++) {
      const availableOptions = days.filter(
        (day) => !selectedDays.includes(day) || selectedDays[i] === day
      );
      containers.push(
        <div key={i} className="day-container">
          <div className="day-title">
            Día {i + 1}:
            <Dropdown
              options={days}
              selectedOption={days.find((day) => day.value === selectedDays[i])}
              onChange={(selected) => handleDayChange(selected, i)}
            />
          </div>
          <div className="routine-area-add">
            <button
              className="btn-add-exercise"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addExercise(i);
              }}
            >
              <i className="bi bi-plus-circle add-routine-icon"></i> Añadir un
              ejercicio para el día {i + 1} (
              {days.find((day) => day.value === selectedDays[i])?.label})
            </button>

            {renderExercises(i)}
            {console.log(selectedDays)}
            {console.log(exercises)}
          </div>
        </div>
      );
    }
    return containers;
  }

  const handleDayChange = (selected, dayIndex) => {
    const newSelectedDays = [...selectedDays];
    newSelectedDays[dayIndex] = selected?.value ?? ''; 
    setSelectedDays(newSelectedDays);
  };

  function renderExercises(dayIndex) {
    if (!exercises[dayIndex]) {
      return <></>;
    }

    return exercises[dayIndex].map((exercise, exerciseIndex) => {
      // Solo muestra los detalles si se ha seleccionado un ejercicio (es decir, el nombre del ejercicio no está vacío).
      const exerciseSelected = exercise.name && exercise.name !== "N/A";
      const isCurrentOrPreviousSuperset =
        exercise.isSuperset ||
        (exerciseIndex > 0 &&
          exercises[dayIndex][exerciseIndex - 1].isSuperset);
      return (
        <>
          <div
            key={exerciseIndex}
            className={`routine-exercise-row ${
              exerciseIndex % 2 === 0 ? "day-even" : "day-odd"
            }`}
          >
            <div className="routine-exercise-header">
              <Dropdown
                options={exerciseList}
                selectedOption={exerciseList.find(
                  (ex) => ex.value === exercise.exerciseId
                )}
                onChange={(selectedExercise) =>
                  handleExerciseTypeChange(
                    selectedExercise,
                    dayIndex,
                    exerciseIndex
                  )
                }
              />

              <i
                className="bi bi-trash exercise-btn-delete"
                onClick={() => removeExercise(dayIndex, exerciseIndex)}
              ></i>
            </div>
            {exerciseSelected && (
              <>
                <div className="routine-exercise-header">
                  {exercise.type !== "Cardiovascular" && (
                    <>
                      <div className="container-center">
                        <div>
                          ¿Es superserie?{" "}
                          <ToolTipInfo
                            message={
                              "Al seleccionar esta opción, se iniciará la primera serie de un ejercicio y, tras finalizarla, comenzará la primera serie del ejercicio siguiente, continuando así hasta completar todas las series."
                            }
                          >
                            <i class="bi bi-info-circle-fill info-icon" />
                          </ToolTipInfo>
                        </div>
                        <Switch
                          checked={exercise.isSuperset}
                          onChange={(e) =>
                            handleIsSupersetChange(
                              dayIndex,
                              exerciseIndex,
                              "isSuperset",
                              e.target.checked
                            )
                          }
                          disabled={
                            // Verifica si el siguiente ejercicio existe y es cardiovascular
                            (exerciseIndex < exercises[dayIndex].length - 1 &&
                              exercises[dayIndex][exerciseIndex + 1].type ===
                                "Cardiovascular") ||
                            // Verifica si es el último ejercicio del día
                            exerciseIndex === exercises[dayIndex].length - 1
                          }
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      </div>
                      <div className="exercise-time-input">
                        <label className="container-center">
                          Descanso entre sets (segs){" "}
                        </label>
                        <NumberInput
                          placeholder="Tiempo en segundos"
                          value={Number(exercise.rest)}
                          min={1}
                          max={600}
                          onChange={(event, rest) =>
                            handleExerciseChange(
                              dayIndex,
                              exerciseIndex,
                              "rest",
                              rest
                            )
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="all-sets-container">
                  {exercise.type !== "Cardiovascular" &&
                    !isCurrentOrPreviousSuperset && (
                      <button
                        type="button"
                        className="btn-add-exercise-set"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newSet = {
                            time: null,
                            reps: null,
                            weight: null,
                          };
                          addSetToExercise(dayIndex, exerciseIndex, newSet);
                        }}
                      >
                        <i className="bi bi-plus-circle add-routine-icon"></i>{" "}
                        Añadir un Set para {exercise.name}
                      </button>
                    )}
                  {exercise.sets.map((setGroup, groupIndex) => (
                    <div key={groupIndex} className="set-group-container">
                      {setGroup.map((set, setIndex) => (
                        <div key={setIndex} className="set-container">
                          {exercise.type !== "Cardiovascular" ? (
                            <>
                              {setIndex === 0 ? (
                                <>
                                  <button
                                    className="dropset-button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const newSet = {
                                        time: null,
                                        reps: null,
                                        weight: null,
                                      };
                                      addDropSetToSet(
                                        dayIndex,
                                        exerciseIndex,
                                        groupIndex,
                                        newSet
                                      );
                                    }}
                                  >
                                    <i className="bi bi-plus-circle add-routine-icon"></i>
                                    Añadir dropset
                                  </button>
                                  <div className="routine-exercise-container">
                                    <div className="container-left">
                                      {exercise.type !== "Cardiovascular" &&
                                        !isCurrentOrPreviousSuperset && (
                                          <i
                                            className="bi bi-trash exercise-btn-delete"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              removeSetFromExercise(
                                                dayIndex,
                                                exerciseIndex,
                                                groupIndex,
                                                setIndex
                                              );
                                            }}
                                          ></i>
                                        )}
                                      <h4>Set {groupIndex + 1}</h4>
                                    </div>
                                    <div className="container-center">
                                      <div>Repeticiones:</div>
                                      <NumberInput
                                        placeholder="..."
                                        value={set.reps}
                                        min={1}
                                        max={1000}
                                        onChange={(event, reps) =>
                                          handleSetChange(
                                            dayIndex,
                                            exerciseIndex,
                                            groupIndex,
                                            setIndex,
                                            "reps",
                                            reps
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="routine-exercise-container">
                                  <div className="container-left2">
                                    <i
                                      className="bi bi-eraser-fill exercise-btn-delete"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeDropSetFromExercise(
                                          dayIndex,
                                          exerciseIndex,
                                          groupIndex,
                                          setIndex
                                        );
                                      }}
                                    ></i>
                                    <h6>Drop-Set {setIndex + 1}</h6>
                                  </div>
                                  <div className="container-center">
                                    Repeticiones:
                                    <NumberInput
                                      placeholder="..."
                                      value={set.reps}
                                      min={1}
                                      max={1000}
                                      onChange={(event, reps) =>
                                        handleSetChange(
                                          dayIndex,
                                          exerciseIndex,
                                          groupIndex,
                                          setIndex,
                                          "reps",
                                          reps
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="routine-exercise-container">
                                Tiempo:
                                <NumberInput
                                  placeholder="..."
                                  value={set.time}
                                  min={1}
                                  max={1000}
                                  onChange={(event, time) =>
                                    handleSetChange(
                                      dayIndex,
                                      exerciseIndex,
                                      groupIndex,
                                      setIndex,
                                      "time",
                                      time
                                    )
                                  }
                                />
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      );
    });
  }

  const removeDropSetFromExercise = (
    dayIndex,
    exerciseIndex,
    groupIndex,
    setIndex
  ) => {
    setExercises((currentExercises) =>
      currentExercises.map((dayExercises, dIndex) => {
        if (dIndex === dayIndex) {
          return dayExercises.map((exercise, eIndex) => {
            if (eIndex === exerciseIndex) {
              // Copia los grupos de sets actuales
              let updatedSetGroups = [...exercise.sets];
              // Calcula el total de sets en el ejercicio
              const totalSets = updatedSetGroups.reduce(
                (acc, group) => acc + group.length,
                0
              );

              // Solo permite la eliminación si hay más de un set en total
              if (totalSets > 1) {
                // Verifica si el grupo de sets y el set específico existen
                if (
                  updatedSetGroups[groupIndex] &&
                  updatedSetGroups[groupIndex][setIndex] !== undefined
                ) {
                  // Elimina el set específico del grupo específico
                  updatedSetGroups[groupIndex] = updatedSetGroups[
                    groupIndex
                  ].filter((_, sIndex) => sIndex !== setIndex);
                  // Si después de eliminar el set, el grupo queda vacío, también se podría optar por eliminar el grupo
                  if (updatedSetGroups[groupIndex].length === 0) {
                    updatedSetGroups = updatedSetGroups.filter(
                      (_, gIndex) => gIndex !== groupIndex
                    );
                  }
                }
              }
              // Actualiza el ejercicio con los sets modificados
              return { ...exercise, sets: updatedSetGroups };
            }
            return exercise;
          });
        }
        return dayExercises;
      })
    );
  };

  const handleSetChange = (
    dayIndex,
    exerciseIndex,
    groupIndex,
    setIndex,
    field,
    value
  ) => {
    setExercises((currentExercises) =>
      currentExercises.map((dayExercises, dIndex) => {
        if (dIndex === dayIndex) {
          return dayExercises.map((exercise, eIndex) => {
            if (eIndex === exerciseIndex) {
              // Actualiza el set específico dentro del subarray correcto
              const updatedSets = exercise.sets.map((setGroup, gIndex) => {
                if (gIndex === groupIndex) {
                  return setGroup.map((set, sIndex) => {
                    if (sIndex === setIndex) {
                      if (
                        exercise.type === "Cardiovascular" &&
                        field === "time"
                      ) {
                        return { ...set, time: Number(value) };
                      } else {
                        return { ...set, [field]: Number(value) };
                      }
                    }
                    return set;
                  });
                }
                return setGroup;
              });
              return { ...exercise, sets: updatedSets };
            }
            return exercise;
          });
        }
        return dayExercises;
      })
    );
  };

  const removeExercise = (dayIndex, exerciseIndex) => {
    setExercises((currentExercises) =>
      currentExercises.map((dayExercises, dIdx) => {
        if (dIdx === dayIndex) {
          // Copia los ejercicios para el día especificado antes de hacer cambios
          const updatedDayExercises = [...dayExercises];

          // Elimina el ejercicio seleccionado
          updatedDayExercises.splice(exerciseIndex, 1);

          // Si el ejercicio eliminado no es el primero, actualiza el ejercicio anterior
          if (exerciseIndex > 0 && updatedDayExercises[exerciseIndex - 1]) {
            updatedDayExercises[exerciseIndex - 1] = {
              ...updatedDayExercises[exerciseIndex - 1],
              isSuperset: false,
            };
          }

          return updatedDayExercises;
        }
        return dayExercises;
      })
    );
  };

  const handleExerciseTypeChange = (
    selectedExercise,
    dayIndex,
    exerciseIndex
  ) => {
    if (!selectedExercise || selectedExercise.value === "") {
      return; // Sale si la selección es "none" o no se seleccionó un ejercicio
    }

    // No hay necesidad de buscar el ejercicio ya que selectedExercise ya contiene la información necesaria

    if (exerciseIndex > 0) {
      const previousExerciseIndex = exerciseIndex - 1;
      const previousExercise = exercises[dayIndex][previousExerciseIndex];
      if (previousExercise && previousExercise.isSuperset) {
        setExercises((currentExercises) =>
          currentExercises.map((dayExercises, dIdx) =>
            dIdx === dayIndex
              ? dayExercises.map((exercise, eIdx) =>
                  eIdx === previousExerciseIndex
                    ? { ...exercise, isSuperset: false }
                    : exercise
                )
              : dayExercises
          )
        );
      }
    }

    setExercises((currentExercises) =>
      currentExercises.map((dayExercises, dIndex) => {
        if (dIndex === dayIndex) {
          return dayExercises.map((exercise, eIndex) => {
            if (eIndex === exerciseIndex) {
              // Configura los valores predeterminados para el ejercicio actualizado con datos de la API
              let updatedExercise = {
                ...exercise,
                // Asume que el tipo de ejercicio (como 'Cardiovascular') viene de otra parte o lo defines de otra manera
                isSuperset: false,
                exerciseId: selectedExercise.value, // ID del ejercicio seleccionado
                name: selectedExercise.label, // Nombre del ejercicio seleccionado
                type: selectedExercise.type, // Tipo de ejercicio seleccionado
                rest: exercise.rest, // Mantén el descanso previamente establecido o ajusta según necesidad
                sets: [[{ reps: null, weight: null, time: null }]], // Reinicia los sets
              };

              // Si el ejercicio anterior tiene isSuperset en true,
              // copia la estructura de sets del ejercicio anterior al ejercicio actualizado
              if (
                exerciseIndex > 0 &&
                currentExercises[dIndex][exerciseIndex - 1].isSuperset
              ) {
                const previousExerciseSets =
                  currentExercises[dIndex][exerciseIndex - 1].sets;
                updatedExercise.sets = previousExerciseSets.map((setGroup) =>
                  setGroup.map(() => ({ reps: null, weight: null, time: null }))
                );
              }

              return updatedExercise;
            }
            return exercise;
          });
        }
        return dayExercises;
      })
    );
  };

  const removeSetFromExercise = (dayIndex, exerciseIndex, groupIndex) => {
    setExercises((currentExercises) =>
      currentExercises.map((dayExercises, dIdx) => {
        if (dIdx === dayIndex) {
          return dayExercises.map((exercise, eIdx) => {
            if (eIdx === exerciseIndex) {
              // Si es un superset y hay más de un grupo de sets, permite eliminar el grupo completo.
              let updatedSets = [...exercise.sets];

              if (exercise.isSuperset && updatedSets.length > 1) {
                updatedSets.splice(groupIndex, 1);
              } else if (!exercise.isSuperset) {
                // Permitir eliminar el grupo si no es un superset o ajustar según necesidad
                updatedSets.splice(groupIndex, 1);
                if (updatedSets.length === 0) {
                  updatedSets.push([{ time: null, reps: null, weight: null }]);
                }
              }

              return { ...exercise, sets: updatedSets };
            }
            return exercise;
          });
        }
        return dayExercises;
      })
    );
  };

  const handleExerciseChange = (dayIndex, exerciseIndex, field, value) => {
    console.log(dayIndex, exerciseIndex, field, value);
    setExercises((currentExercises) =>
      currentExercises.map((dayExercises, idx) =>
        idx === dayIndex
          ? dayExercises.map((exercise, exIdx) =>
              exIdx === exerciseIndex
                ? { ...exercise, [field]: Number(value) }
                : exercise
            )
          : dayExercises
      )
    );
  };

  const handleIsSupersetChange = (dayIndex, exerciseIndex, field, value) => {
    // Actualiza el estado isSuperset del ejercicio actual
    setExercises((currentExercises) =>
      currentExercises.map((dayExercises, dIdx) =>
        dIdx === dayIndex
          ? dayExercises.map((exercise, eIdx) =>
              eIdx === exerciseIndex
                ? { ...exercise, [field]: value }
                : exercise
            )
          : dayExercises
      )
    );

    // Si el switch se activa a true, actualiza el ejercicio siguiente para que tenga la misma cantidad de sets
    if (
      value === true &&
      dayIndex < exercises.length &&
      exerciseIndex < exercises[dayIndex].length - 1
    ) {
      const nextExerciseIndex = exerciseIndex + 1;
      const currentExerciseSets = exercises[dayIndex][exerciseIndex].sets;

      setExercises((currentExercises) =>
        currentExercises.map((dayExercises, dIdx) =>
          dIdx === dayIndex
            ? dayExercises.map((exercise, eIdx) => {
                if (eIdx === nextExerciseIndex) {
                  // Copia la estructura de sets del ejercicio actual al siguiente
                  let updatedSets = currentExerciseSets.map((setGroup) =>
                    setGroup.map(() => ({
                      time: null,
                      reps: null,
                      weight: null,
                    }))
                  );

                  return {
                    ...exercise,
                    sets: updatedSets,
                  };
                }
                return exercise;
              })
            : dayExercises
        )
      );
    }
  };

  function secondsToTimeFormat(seconds) {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
  
    return `${hours}:${minutes}:${secs}`;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("handleSubmit se está ejecutando");
    // Verifica si el nombre de la rutina está vacío
    if (!routineName.trim()) {
      alert("Por favor, ingresa el nombre de la rutina.");
      return;
    }

    // Verifica si algún día seleccionado está vacío
    const isAnyDayEmpty = selectedDays.some((day) => day === "");
    if (isAnyDayEmpty) {
      alert("Por favor, selecciona un día para cada ejercicio.");
      return;
    }

    // Verifica que cada día seleccionado tenga al menos un ejercicio
    const isAnyDayWithoutExercise = exercises.some(
      (dayExercises) => dayExercises.length === 0
    );
    if (isAnyDayWithoutExercise) {
      alert(
        "Por favor, asegúrate de añadir al menos un ejercicio por cada día seleccionado."
      );
      return;
    }

    // Verifica que todos los ejercicios tengan un nombre y no sea "N/A"
    const isAnyExerciseInvalid = exercises.some((dayExercises) =>
      dayExercises.some((exercise) => exercise.name === "N/A" || !exercise.name)
    );
    if (isAnyExerciseInvalid) {
      alert(
        'Por favor, asegúrate de que todos los ejercicios tengan un nombre válido. Ningún ejercicio debe ser "N/A" o estar vacío.'
      );
      return;
    }

    // Verifica que todos los sets de ejercicios de pesas o peso corporal tengan repeticiones
    const isAnyWeightExerciseSetInvalid = exercises.some((dayExercises) =>
      dayExercises.some(
        (exercise) =>
          (exercise.type === "Pesas" || exercise.type === "Peso Corporal") &&
          exercise.sets.some((setGroup) =>
            setGroup.some(
              (set) =>
                set.reps === null || set.reps === undefined || set.reps === 0
            )
          )
      )
    );

    if (isAnyWeightExerciseSetInvalid) {
      alert(
        "Por favor, asegúrate de que todos los ejercicios tengan un número válido de repeticiones en cada set."
      );
      return;
    }

    // Verifica que todos los sets de ejercicios cardiovasculares tengan un tiempo
    const isAnyCardioExerciseSetInvalid = exercises.some((dayExercises) =>
      dayExercises.some(
        (exercise) =>
          exercise.type === "Cardiovascular" &&
          exercise.sets.some((setGroup) =>
            setGroup.some(
              (set) =>
                set.time === null || set.time === undefined || set.time === 0
            )
          )
      )
    );

    if (isAnyCardioExerciseSetInvalid) {
      alert(
        "Por favor, asegúrate de que todos los ejercicios cardiovasculares tengan un tiempo válido en cada set."
      );
      return;
    }

    console.log("llegue aqui");
    console.log(activeAccount.idTokenClaims.oid);

    try {
      if (
        !exercises ||
        exercises.length === 0 ||
        !selectedDays ||
        selectedDays.length === 0
      ) {
        alert("Asegúrate de haber agregado ejercicios y seleccionado días.");
        return;
      }
      // Asegúrate de tener un 'oid' definido, aquí lo pongo estático para el ejemplo
      const oid = activeAccount.idTokenClaims.oid;

      // Preparar la estructura de 'days' según lo esperado por el backend
      const daysPayload = selectedDays.map((dayValue, index) => {
        const dayExercises = exercises[index] || [];
        return {
          selectedDay: dayValue,
          ejercicios: dayExercises.map((exercise) => ({
            exerciseId: exercise.exerciseId, // Asegúrate de que este campo exista y sea correcto.
            name: exercise.name, // Verifica que `name` esté correctamente definido en tus objetos de ejercicio.
            rest: exercise.rest, // Verifica que `rest` también esté correctamente definido.
            isSuperset: exercise.isSuperset, // Añade esta línea
            sets: exercise.sets.flat().map((set) => ({
              reps: set.reps,
              weight: set.weight,
              time: set.time ? secondsToTimeFormat(set.time) : null,
              isDropSet: set.isDropSet || false, 
            })),
          })),
        };
      });

      const payload = {
        oid: activeAccount.idTokenClaims.oid,
        routineName,
        days: daysPayload,
      };

      console.log("Request al server: ",payload);

      const response = await fetch(`${config.apiBaseUrl}/rutinacompleta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Rutina guardada con éxito");
        onBackToList();
      } else {
        const error = await response.json();
        console.log("Ocurrio un error", error.message);
        alert("Ocurrio un error", error.message);
      }
    } catch (error) {
      alert("Error al guardar la rutina: " + error.message);
    }
  };

  return (
    <div className="container2">
      <div className="add_header2">
        <button className="back_icon card-icon" onClick={onBackToList}>
          <i className="bi bi-arrow-left"></i>{" "}
        </button>
        <h1 className="mtitle">Crear una Rutina nueva</h1>
      </div>
      <form className="form_add_exercise" onSubmit={handleSubmit}>
        <div className="add_exercise_area2">
          <div className="routine-header-container">
            <div className="add_exercise_rows2">
              ¿Cuál es el nombre de la rutina?
              <input
                type="text"
                className="add_exercise_input"
                value={routineName}
                onChange={handleRoutineNameChange}
              />
            </div>
            <div className="add_exercise_rows2">
              Días por semana de la rutina
              <NumberInput
                placeholder="…"
                value={Number(daysPerWeek)}
                min={1}
                max={7}
                onChange={(event, days) => setDaysPerWeek(days)}
              />
            </div>
          </div>
          <div className="days-main-container">
            {generateDayContainers(daysPerWeek)}
          </div>
        </div>
        <button className="add_button" type="submit">
          Guardar Rutina
        </button>
      </form>
    </div>
  );
}
