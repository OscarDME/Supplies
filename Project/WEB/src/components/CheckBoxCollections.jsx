import React from 'react';

function CheckboxList({ options, selectedOptions, onChange, idPrefix }) {

    const handleCheckboxChange = (event) => {
        const changedValue = parseInt(event.target.value, 10);
        const isChecked = event.target.checked;
    
        let newSelectedOptions;
        if (isChecked) {
          // Agrega el valor si el checkbox está marcado
          newSelectedOptions = [...selectedOptions, changedValue];
        } else {
          // Elimina el valor si el checkbox está desmarcado
          newSelectedOptions = selectedOptions.filter(value => value !== changedValue);
        }
    
        // Invoca el callback con los valores actualizados
        onChange(newSelectedOptions);
      };
  return (
    <div style={{ borderRadius: "10px", maxHeight: '150px', overflowY: 'scroll', border: '1px solid #CCCCCC', padding: '10px' }}>
      {options.map((option, index) => (
        <div key={index} style={{ padding: "5px" }} className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="form-check-input"
            id={`${idPrefix}-${option.value}`} // Usar value para ID único
            name={option.label} // Usar label para el nombre
            value={option.value} // Agregar propiedad value
            checked={selectedOptions.includes(option.value)} // Cambiar condición para verificar inclusión
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor={`${idPrefix}-${option.value}`}>
            {option.label} 
          </label>
        </div>
      ))}
    </div>
  );
}

export default CheckboxList;
