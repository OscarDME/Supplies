import React, { useEffect, useState } from 'react';
import { ToolTipInfo } from '../ToolTipInfo';
import NumberInput from '../NumberInput';

export default function AssignRoutinesModify({ onBackToList, selectedUser ,selectedRoutine, onRoutineUpdate }) {

  const [updatedRoutine, setUpdatedRoutine] = useState(selectedRoutine);


  useEffect(() => {
  setUpdatedRoutine(selectedRoutine); // Asignar selectedRoutine a updatedRoutine
}, [selectedRoutine]);

  
  function renderExercises(day, dayIndex) {
    return day.ejercicios.map((exercise, exerciseIndex) => {
      let dropsetCount = 0;

      return (
        <div key={exerciseIndex} className='exercise-not-superserie'>
          {exerciseIndex > 0 && day.ejercicios[exerciseIndex - 1].superset ? (
            <>
              <div className="red-element bar-top"></div>
              <div className="red-element dot-top"></div>
            </>
          ) : null}
          <h4>{exercise.ejercicio}</h4>
          {exercise.bloqueSets.map((bloque, groupIndex) =>
            bloque.conjuntoSeries.flatMap((conjunto, setIndex) => {
              const isMainSet = conjunto.series[0].ID_SeriePrincipal === null;
              const setNumber = isMainSet ? ++groupIndex : null;

              return (
                <div key={setIndex} className='set-container-modify'>
                  {exercise.Modalidad !== "Cardiovascular" ? (
                    <>
                      <div className='set-info'>
                        {isMainSet ? `Set ${setNumber}` : `Dropset ${++dropsetCount}`}
                      </div>
                      <div className='container-center'>
                        Repeticiones:
                        <NumberInput
                          label="Repeticiones"
                          placeholder="..."
                          value={Number(conjunto.series[0].repeticiones)}
                          min={1}
                          max={600}
                          onChange={(event ,reps) => handleSetChange(dayIndex, exerciseIndex, 0, setIndex, 'repeticiones', reps)}
                        />

                      </div>
                      <div className='container-center'>
                        Peso (kg):
                        <NumberInput
                          label="Peso"
                          placeholder="..."
                          min={1}
                          max={600}
                          value={Number(conjunto.series[0].peso)}
                          onChange={(event ,peso) => handleSetChange(dayIndex, exerciseIndex, 0, setIndex, 'peso', peso)}
                        />
                      </div>
                    </>
                  ) : (
                    <div className='container-center'>
                      Tiempo (minutos):
                        <NumberInput
                          label="Tiempo"
                          placeholder="..."
                          min={1}
                          max={600}
                          value={Number(conjunto.series[0].tiempoEnSegundos)}
                          onChange={(event ,tiempo) => handleSetChange(dayIndex, exerciseIndex, 0, setIndex, 'tiempo', tiempo)}
                        />
                    </div>
                  )}
                </div>
              );
            })
          )}
          {exercise.superset ? (
            <>
              <div className="red-element bar-bottom"></div>
              <div className="red-element dot-bottom"></div>
            </>
          ) : null}
        </div>
      );
    });
  }
  
  
  const handleNumberInputChange = (dayIndex, exerciseIndex, groupIndex, setIndex, field) => (event) => {
    console.log(event);
    console.log("Valor", event.target.value);
    const value = event.target.value;
    handleSetChange(dayIndex, exerciseIndex, groupIndex, setIndex, field, value);
  };

  
  


 const handleSetChange = (dayIndex, exerciseIndex, groupIndex, setIndex, field, value) => {
  console.log("DayIndex:", dayIndex);
  console.log("ExerciseIndex:", exerciseIndex);
  console.log("GroupIndex:", groupIndex);
  setUpdatedRoutine((prevState) => {

    // Si todo está correcto, sigue con la actualización
    const newState = JSON.parse(JSON.stringify(prevState)); // Copia profunda del estado
    console.log(newState.diasEntreno[dayIndex].ejercicios[exerciseIndex].bloqueSets[groupIndex]);


    newState.diasEntreno[dayIndex].ejercicios[exerciseIndex]
      .bloqueSets[groupIndex].conjuntoSeries[setIndex]
      .series[0][field] = Number(value);

    return newState; // Devuelve el nuevo estado actualizado
  });
};

  
  

  useEffect(() => {
    if (updatedRoutine) {
      onRoutineUpdate(updatedRoutine);
    }
  }, [updatedRoutine, onRoutineUpdate]);
  
  
  
  

  return (
    <div className='add_header2'>
      <div className='container3'>
        <div className='modify-header'>
          <button className="back_icon2 card-icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i></button>
          <div className='title-set-modify'>
            <h5 className='MainTitle'>Asignar valores a {updatedRoutine?.nombre}</h5>
            <ToolTipInfo message={"Las barras rojas conectan ejercicios que tienen superseries."}><i className="bi bi-info-circle-fill info-icon"/></ToolTipInfo>
          </div>
        </div>
        <div className='days-main-container2'>
          <div>
            <div className='routine-selection'>
              {updatedRoutine?.diasEntreno.map((day, index) => (
                <div key={index} className="day-container2">
                  <div>
                    <h3 className="day-title">Día {index + 1} - {day.NombreDia}</h3>
                  </div>
                  {renderExercises(day, index)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
