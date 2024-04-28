// Dropdown.js
import React from 'react';
import '../styles/dropdown.css';

function Dropdown({ options, selectedOption, onChange }) {
  return (
    <div>
      <select value={selectedOption} onChange={onChange} className='dropdown' required>
        <option className='item' value="none">N/A</option>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;

