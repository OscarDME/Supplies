import React, { useState, useEffect } from "react";

function CheckboxList({ options, onChange, idPrefix, initialPortions }) {
  const [portions, setPortions] = useState(initialPortions || {});

  useEffect(() => {
    // Verifica si initialPortions es válido antes de actualizar portions
    if (initialPortions) {
      setPortions(initialPortions);
    }
  }, [initialPortions]);

  const handleCheckboxChange = (event) => {
    const optionValue = event.target.value;
    const isChecked = event.target.checked;
    setPortions((prev) => {
      const newPortions = { ...prev };
      if (isChecked) {
        // Si el checkbox se marca y no hay valor previo, inicializa con un valor vacío o predeterminado
        newPortions[optionValue] = newPortions[optionValue] || '';
      } else {
        // Si el checkbox se desmarca, elimina la entrada del objeto
        delete newPortions[optionValue];
      }
      return newPortions;
    });
  };

  const handlePortionChange = (event, optionValue) => {
    const newPortion = event.target.value;
    setPortions((prev) => ({ ...prev, [optionValue]: newPortion }));
  };

  useEffect(() => {
    // Comunica al componente padre los cambios en las porciones
    onChange(Object.keys(portions).map((key) => ({
      ID_Alimento: parseInt(key, 10),
      porcion: parseFloat(portions[key]) || 0
    })));
  }, [portions, onChange]);


  return (
    <div style={{ borderRadius: "10px", maxHeight: "150px", overflowY: "scroll", border: "1px solid #CCCCCC", padding: "10px" }}>
      {options.map((option) => (
        <div key={option.value} style={{ display: "flex", alignItems: "center", padding: "5px" }}>
          <input
            type="checkbox"
            className="form-check-input"
            id={`${idPrefix}-${option.value}`}
            name={option.label}
            value={option.value}
            checked={portions.hasOwnProperty(option.value)}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor={`${idPrefix}-${option.value}`}>
            {option.label}
          </label>
          {portions.hasOwnProperty(option.value) && (
            <input
              type="number"
              className="form-control"
              style={{ marginLeft: "15px", width: "120px" }}
              value={portions[option.value]}
              onChange={(e) => handlePortionChange(e, option.value)}
              min="0"
              placeholder="Porción"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default CheckboxList;
