import React from 'react';
import '../styles/dropdown.css';

function Dropdown({ options, selectedOption, onChange }) {
  // Añade una opción inicial "N/A" al principio de las opciones
  const optionsWithInitial = [{ value: 'NA', label: 'N/A' }, ...options];

  // Manejador de cambios adaptado para manejar objetos completos
  const handleChange = (event) => {
    const value = event.target.value;
    // Encuentra el objeto de opción seleccionado basado en el valor
    const selected = optionsWithInitial.find(option => option.value.toString() === value);
    console.log(selected);
    onChange(selected); // Llama a onChange con el objeto seleccionado
  };

  return (
    <select 
      value={selectedOption?.value ?? 'NA'} // Utiliza 'NA' como valor predeterminado
      onChange={handleChange} 
      className="dropdown"
    >
      {optionsWithInitial.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Dropdown;