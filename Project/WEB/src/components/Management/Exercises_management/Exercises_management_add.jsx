import React, { useState } from "react";
import '../../../styles/Management.css';
import Dropdown from "../../DropdownCollections";
import CheckboxList from "../../CheckBoxCollections";
import RadioList from "../../RadioList";
import config from "../../../utils/conf";

export default function Exercises_management_add({ onBackToList }) {
  const [exerciseName, setExerciseName] = useState("");
  const [affectedInjury, setAffectedInjury] = useState(null); // Cambiado a null para un estado inicial claro
  const [selectedMuscles, setSelectedMuscles] = useState([]); // Ahora solo para músculos secundarios
  const [primaryMuscle, setPrimaryMuscle] = useState(null); // Nuevo estado para músculo principal
  const [exerciseType, setExerciseType] = useState(null); // Cambiado a null
  const [materialNeeded, setMaterialNeeded] = useState(null);
  const [exercisePreparation, setExercisePreparation] = useState("");
  const [exerciseIndications, setExerciseIndications] = useState("");
  const [exerciseDificulty, setExerciseDificulty] = useState(null); // Cambiado a null
  const [selectedModalidad, setSelectedModalidad] = useState(null);

  const lesiones = [
    { label: "Hombro", value: 1 },
    { label: "Lumbar", value: 2 },
    { label: "Rodilla", value: 3 },
    { label: "Tobillo", value: 4 },
  ];
  const options = [
    { label: "Baja", value: 1 },
    { label: "Media", value: 2 },
    { label: "Alta", value: 3 },
  ];
  const exercises = [
    { label: "Cardiovascular", value: 1 },
    { label: "Peso corporal", value: 3 },
    { label: "Pesas", value: 2 },
  ];
  const materials = [
    { label: "Mancuerna", value: 1 },
    { label: "Ligas Resistencia", value: 2 },
    { label: "Soga", value: 3 },
    { label: "Pelota de Yoga", value: 4 },
    { label: "Tapete", value: 5 },
    { label: "Barra", value: 6 },
    { label: "Maquina", value: 7 },
    { label: "Polea", value: 8 },
  ];
  const muscles = [
    { label: "Pecho", value: 1 },
    { label: "Espalda", value: 2 },
    { label: "Hombro", value: 3 },
    { label: "Bicep", value: 4 },
    { label: "Tricep", value: 5 },
    { label: "Cuadricep", value: 6 },
    { label: "Femoral", value: 7 },
    { label: "Gluteo", value: 8 },
    { label: "Pantorrilla", value: 9 },
  ];

  const modalidad = [
    { label: "Peso Corporal", value: 1 },
    { label: "Pesas", value: 2 },
    { label: "Cardiovascular", value: 3 },
  ];

  const types = [
    { label: "Compuesto", value: 1 },
    { label: "Auxiliar", value: 2 },
    { label: "Aislamiento", value: 3 },
    { label: "Funcional", value: 4 },
  ];

  const handlePrimaryMuscleChange = (selectedOption) =>
    setPrimaryMuscle(selectedOption ? selectedOption.value : null);

  const handleExerciseNameChange = (event) =>
    setExerciseName(event.target.value);

  const handleAffectedInjuryChange = (selectedOption) =>
    setAffectedInjury(selectedOption ? selectedOption.value : null);

  const handleAffectedDificultyChange = (selectedOption) =>
    setExerciseDificulty(selectedOption ? selectedOption.value : null);

  const handleExerciseTypeChange = (selectedOption) => {
    setMaterialNeeded([]);
    setExerciseType(selectedOption ? selectedOption.value : null);
  };

  const handleExerciseIndicationsChange = (event) =>
    setExerciseIndications(event.target.value);

  const handleExercisePreparationChange = (event) =>
    setExercisePreparation(event.target.value);

  const handleSelectedMusclesChange = (selectedValues) => {
    setSelectedMuscles(selectedValues);
  };

  const handleModalidadChange = (selectedOption) =>
    setSelectedModalidad(selectedOption ? selectedOption.value : null);

const handleMaterialNeededChange = (selectedOption) => {
  // selectedOption ya es un valor único y no un array
  setMaterialNeeded(selectedOption);
};

const isCardio = selectedModalidad === 3;

  const esModalidadPesas = selectedModalidad === 2;

  const handleSubmit = async (event) => {

    event.preventDefault();
    const regex = /^[\p{L}\p{N} _.,'"-]+$/u;
  
      
    if (exerciseName.length > 50 || !regex.test(exerciseName)) {
      alert("El nombre del ejercicio contiene caracteres no permitidos o es demasiado largo. Debe tener 50 caracteres o menos y solo puede contener letras, números, espacios, guiones y guiones bajos.");
      return;
    }

    if (exercisePreparation.length > 500 || !regex.test(exercisePreparation)) {
      alert("Las indicaciones de preparación contienen caracteres no permitidos o son demasiado largas. Deben tener 500 caracteres o menos y solo pueden contener letras, números, espacios, guiones, guiones bajos, puntos y comas.");
      return; 
    }

    if (exerciseIndications.length > 500 || !regex.test(exerciseIndications)) {
      alert("Las indicaciones de ejecución contienen caracteres no permitidos o son demasiado largas. Deben tener 500 caracteres o menos y solo pueden contener letras, números, espacios, guiones, guiones bajos, puntos y comas.");
      return; 
    }

    const finalPrimaryMuscle = isCardio ? null : primaryMuscle;
  const finalSelectedMuscles = isCardio ? [] : selectedMuscles;

  if (
    !exerciseName.trim() ||
    !exercisePreparation.trim() ||
    !exerciseIndications.trim() ||
    exerciseDificulty === null ||
    (esModalidadPesas && (materialNeeded === null || materialNeeded.length === 0)) ||
    (!isCardio && selectedMuscles.length === 0) || // Solo validar músculos para no cardio
    (!isCardio && affectedInjury === null) // No validar lesión si es cardio
  ) {
    alert("Por favor completa todos los campos obligatorios.");
    return;
  }

  const exerciseData = {
    ejercicio: exerciseName,
    preparacion: exercisePreparation,
    ejecucion: exerciseIndications,
    ID_Musculo: finalPrimaryMuscle,
    ID_Lesion: affectedInjury,
    ID_Tipo_Ejercicio: exerciseType,
    ID_Dificultad: exerciseDificulty,
    ID_Equipo: materialNeeded,
    ID_Modalidad: selectedModalidad,
    musculosSecundarios: finalSelectedMuscles,
  };
    console.log(exerciseData);

    try {
      // Realizar la solicitud POST al servidor
      const response = await fetch(`${config.apiBaseUrl}/ejercicios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exerciseData),
      });

      if (!response.ok) {
        throw new Error("Algo salió mal al guardar el ejercicio.");
      }

      // Respuesta del servidor
      const result = await response.json();
      console.log(result);
      alert("Ejercicio añadido con éxito.");
      // Aquí podrías redirigir al usuario o limpiar el formulario
      onBackToList(); // Si deseas volver a la lista de ejercicios o manejar la navegación de otra manera
    } catch (error) {
      console.error("Error al guardar el ejercicio:", error);
      alert("Error al guardar el ejercicio.");
    }

    console.log("Guardando ejercicio:", {
      exerciseName,
      affectedInjury,
      selectedMuscles,
      exerciseType,
      materialNeeded,
      exercisePreparation,
      exerciseIndications,
      exerciseDificulty,
    });

    onBackToList();
  };

  // Función auxiliar para encontrar el objeto de opción basado en el valor
  const findOptionByValue = (optionsArray, value) =>
    optionsArray.find((option) => option.value === value) || null;

  return (
    <div className="container">
      <div className="add_header">
        <button className="back_icon" onClick={onBackToList}>
          <i className="bi bi-arrow-left card-icon"></i>
        </button>
        <h1 className="mtitle">Añadir un ejercicio nuevo</h1>
      </div>
      <form className="form_add_exercise" onSubmit={handleSubmit}>
        <div className="add_exercise_area">
          <div>
            {/* Nombre del ejercicio */}
            <div className="add_exercise_rows">
              ¿Cuál es el nombre del ejercicio?
              <input
                type="text"
                className="add_exercise_input"
                value={exerciseName}
                onChange={handleExerciseNameChange}
              />
            </div>
            {/* Lesión */}
            <div className="add_exercise_rows">
              ¿Afecta a alguna lesión?
              <Dropdown
                options={lesiones}
                selectedOption={findOptionByValue(lesiones, affectedInjury)}
                onChange={handleAffectedInjuryChange}
              />
            </div>
            {/* Dificultad */}
            <div className="add_exercise_rows">
              ¿Cuál es la dificultad del ejercicio?
              <Dropdown
                options={options}
                selectedOption={findOptionByValue(options, exerciseDificulty)}
                onChange={handleAffectedDificultyChange}
              />
            </div>
            {/* Preparación */}
            <div className="add_exercise_rows">
              Indicaciones de preparación:
              <textarea
                className="add_exercise_textarea"
                value={exercisePreparation}
                onChange={handleExercisePreparationChange}
              ></textarea>
            </div>
          </div>
          <div>
            {/* Músculo principal */}
            {selectedModalidad !== 3 && (
              <div className="add_exercise_rows">
                ¿Cuál es el músculo principal trabajado?
                <Dropdown
                  options={muscles}
                  selectedOption={findOptionByValue(muscles, primaryMuscle)}
                  onChange={handlePrimaryMuscleChange}
                />
              </div>
            )}
            {/* Músculos secundarios */}
            {selectedModalidad !== 3 && (
              <div className="add_exercise_rows">
                ¿Qué músculos secundarios trabaja?
                <CheckboxList
                  options={muscles}
                  selectedOptions={selectedMuscles}
                  onChange={handleSelectedMusclesChange}
                  idPrefix="muscles"
                />
              </div>
            )}
            {/* Indicaciones */}
            <div className="add_exercise_rows">
              Indicaciones de ejecución:
              <textarea
                className="add_exercise_textarea"
                value={exerciseIndications}
                onChange={handleExerciseIndicationsChange}
              ></textarea>
            </div>
          </div>
          <div>
            {/* Tipo de ejercicio */}
            <div className="add_exercise_rows">
              ¿Qué tipo de ejercicio es?
              <Dropdown
                options={types}
                selectedOption={findOptionByValue(types, exerciseType)}
                onChange={handleExerciseTypeChange}
              />
            </div>
            {/* Modalidad */}
            <div className="add_exercise_rows">
              ¿Cuál es la modalidad del ejercicio?
              <Dropdown
                options={modalidad}
                selectedOption={findOptionByValue(modalidad, selectedModalidad)}
                onChange={handleModalidadChange}
              />
            </div>
            {/* Material necesario */}
            {esModalidadPesas && (
              <div className="add_exercise_rows">
                ¿Qué material necesita el ejercicio?
                <RadioList
                  options={materials} // Tus opciones
                  selectedOption={materialNeeded} // Asegúrate de que este sea un único valor, no un array
                  onChange={setMaterialNeeded} // Actualiza para manejar el cambio a un único valor
                  idPrefix="material"
                />
              </div>
            )}
          </div>
        </div>
        <button type="submit" className="add_button">
          Añadir ejercicio
        </button>
      </form>
    </div>
  );
}
