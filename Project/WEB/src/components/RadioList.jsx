import React from 'react';

function RadioList({ options, selectedOption, onChange, idPrefix }) {

    const handleRadioChange = (event) => {
        const changedValue = parseInt(event.target.value, 10);
        // Invoca el callback con el valor actualizado
        onChange(changedValue);
    };

  return (
    <div style={{ borderRadius: "10px", maxHeight: '150px', overflowY: 'scroll', border: '1px solid #CCCCCC', padding: '10px' }}>
      {options.map((option, index) => (
        <div key={index} style={{ padding: "5px" }} className="custom-control custom-radio">
          <input
            type="radio"
            className="form-check-input"
            id={`${idPrefix}-${option.value}`} // Usar value para ID único
            name={idPrefix} // Todos los radio inputs deben compartir el mismo name
            value={option.value} // Agregar propiedad value
            checked={selectedOption === option.value} // Verificar si es el valor seleccionado
            onChange={handleRadioChange}
          />
          <label className="form-check-label" htmlFor={`${idPrefix}-${option.value}`}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
}

export default RadioList;
