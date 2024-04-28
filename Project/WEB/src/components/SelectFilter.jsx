import React from 'react';

const SelectFilter = ({ value, onChange, options, defaultOption }) => {
  return (
    <select onChange={onChange} value={value} className='dropdown'>
      <option value="">{defaultOption}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
};

export default SelectFilter;
