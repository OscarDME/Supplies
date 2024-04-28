// Dropdown.js
import React from 'react';
import '../styles/dropdown.css';

function Dropdown({ options, selectedOption, onChange }) {
  const handleChange = (event) => {
    const value = event.target.value;
    const selected = options.find(option => option.value.toString() === value);
    onChange(selected);
  };

  return (
    <div>
      <select value={selectedOption?.value ?? ''} onChange={handleChange} className='dropdown'>
        <option value="">N/A</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
