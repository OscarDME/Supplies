import React, { useState, useEffect } from 'react';
import "../styles/Management.css";
import NumberInput from '../components/NumberInput';
import Dropdown from '../components/DropdownCollections';
import config from "../utils/conf";

export const NewProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(null);

  const categoryOptions = [
    { value: 1, label: 'Suelas' },
    { value: 2, label: 'Plataformas' },
    { value: 3, label: 'Tacones' },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${config.apiBaseUrl}/producto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Producto: name,
          ID_Tipo: category?.value,
          Descripcion: description,
          Precio: price,
          Stock: true,
        }),
      });

      if (response.ok) {
        // Producto agregado exitosamente
        setName('');
        setDescription('');
        setPrice('');
        setCategory(null);
        window.location.reload();
        } else {
        // Manejar el error de la API
        console.error('Error al agregar el producto');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };

  const handleNameChange = (event) => setName(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);
  const handlePriceChange = (event) => setPrice(event.target.value);
  const handleCategoryChange = (selectedOption) => setCategory(selectedOption);

  return (
    <div className='container'>
      <div className='add_header'>
        <h1 className='mtitle'>Agregar producto</h1>
      </div>
      <form className="form_add_exercise" onSubmit={handleSubmit}>
        <div className="add_exercise_area">
          <div>
            <div className="add_exercise_rows">
              Nombre
              <input
                type="text"
                className="add_exercise_input"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div className="add_exercise_rows">
              Precio
              <NumberInput
                placeholder="…"
                value={Number(price)}
                min={0}
                max={5000}
                onChange={(event, price) => setPrice(price)}
              />
            </div>
            <div className="add_exercise_rows">
              Descripción
              <textarea
                className="add_exercise_textarea"
                value={description}
                onChange={handleDescriptionChange}
              ></textarea>
            </div>
          </div>
          <div>
            <div className="add_exercise_rows">
              Categoría
              <Dropdown
                options={categoryOptions}
                selectedOption={category}
                onChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>
        <button type="submit" className="add_button">
          Añadir Producto
        </button>
      </form>
    </div>
  );
};