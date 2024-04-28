import React, { useState, useEffect } from "react";
import "./styles/Management.css";
import Dropdown from "../../DropdownCollections";
import CheckboxList from "../../CheckBoxCollections";
import RadioList from "../RadioList";
import config from "../../utils/conf";

export default function Exercises_management_edit({ exercise, onBackToList  }) {
  const [exerciseDetails, setExerciseDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [exerciseName, setExerciseName] = useState("");
  const [affectedInjury, setAffectedInjury] = useState(null); // Cambiado a null para un estado inicial claro
  const [selectedMuscles, setSelectedMuscles] = useState([]); // Ahora solo para músculos secundarios
  const [primaryMuscle, setPrimaryMuscle] = useState(null); // Nuevo estado para músculo principal
  const [exerciseType, setExerciseType] = useState(null); // Cambiado a null
  const [materialNeeded, setMaterialNeeded] = useState([]);
  const [exercisePreparation, setExercisePreparation] = useState("");
  const [exerciseIndications, setExerciseIndications] = useState("");
  const [exerciseDificulty, setExerciseDificulty] = useState(null); // Cambiado a null
  const [selectedModalidad, setSelectedModalidad] = useState(null);

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/ejercicio/${exercise.ID_Ejercicio}`);
        if (!response.ok) throw new Error('Failed to fetch exercise details');
        const data = await response.json();
        setExerciseDetails(data);
        setExerciseName(data.ejercicio);
        setPrimaryMuscle(data.ID_Musculo);
        setExerciseType(data.ID_Tipo_Ejercicio);
        const selectedMusclesMapped = data.musculosSecundarios.map(ms => {
          const muscle = muscles.find(m => m.value === ms.ID_Musculo);
          return muscle ? muscle.value : null; // Aquí asumimos que quieres los valores, ajusta según necesites
        }).filter(ms => ms != null); // Elimina los nulos si el ID_Musculo no se encontró
  
        setSelectedMuscles(selectedMusclesMapped);
  
        // Similar para `materialNeeded`, ajusta según cómo estés manejando esos datos
        // Si `ID_Equipo` es un único valor, pero `CheckboxList` espera un array, debes convertirlo:
        setMaterialNeeded(data.ID_Equipo);        
        setExercisePreparation(data.preparacion);
        setExerciseIndications(data.ejecucion);
        setExerciseDificulty(data.ID_Dificultad);
        setSelectedModalidad(data.ID_Modalidad);
        setAffectedInjury(data.ID_Lesion);

        console.log(data);
        // Aquí también podrías cargar las opciones de los dropdowns si son dinámicas
      } catch (error) {
        console.error("Error fetching exercise details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExerciseDetails();
  }, [exercise.ID_Ejercicio]);

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

  const handleModalidadChange = (selectedOption) => {
    setSelectedModalidad(selectedOption ? selectedOption.value : null);
  
    if (selectedOption && selectedOption.value !== 2) { 
      setMaterialNeeded(null); // Establece materialNeeded como null
    }
  };
  

    const handleMaterialNeededChange = (selectedOptions) => {
      // Assuming selectedOptions is an array of integers
      setMaterialNeeded(selectedOptions);
    };
    
  const esModalidadPesas = selectedModalidad === 2;
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Prepara los datos del formulario para enviarlos al backend
    const exerciseData = {
      ejercicio: exerciseName,
      preparacion: exercisePreparation,
      ejecucion: exerciseIndications,
      ID_Musculo: primaryMuscle,
      ID_Tipo_Ejercicio: exerciseType,
      ID_Dificultad: exerciseDificulty,
      ID_Equipo: materialNeeded, 
      ID_Modalidad: selectedModalidad,
      ID_Lesion: affectedInjury,
      musculosSecundarios: selectedMuscles.map(muscle => ({ ID_Musculo: muscle })) // Asegúrate de que este sea el formato esperado por tu backend
    };
  
    try {
      const response = await fetch(`${config.apiBaseUrl}/ejercicio/${exercise.ID_Ejercicio}`, {
        method: 'PUT', // o 'PATCH' dependiendo de tu backend
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseData),
      });
  
      if (!response.ok) {
        throw new Error('Hubo un problema al actualizar el ejercicio');
      }
  
      const result = await response.json();
      console.log(result); // Puedes mostrar un mensaje de éxito o redirigir al usuario
      alert("Ejercicio modificado con éxito.");
    } catch (error) {
      alert("Error al modificar el ejercicio.");
      console.error('Error al actualizar el ejercicio:', error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  };
  

  // Función auxiliar para encontrar el objeto de opción basado en el valor
  const findOptionByValue = (optionsArray, value) =>
    optionsArray.find((option) => option.value === value) || null;

  return (
    <div className="container">
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
            <div className="add_exercise_rows">
              ¿Cuál es el músculo principal trabajado?
              <Dropdown
                options={muscles}
                selectedOption={findOptionByValue(muscles, primaryMuscle)}
                onChange={handlePrimaryMuscleChange}
              />
            </div>
            {/* Músculos secundarios */}
            <div className="add_exercise_rows">
              ¿Qué músculos secundarios trabaja?
              <CheckboxList
                options={muscles}
                selectedOptions={selectedMuscles}
                onChange={handleSelectedMusclesChange}
                idPrefix="muscles"
              />
            </div>
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
          Modificar ejercicio
        </button>
      </form>
    </div>
  );
}
