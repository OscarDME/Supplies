import React, {useState, useEffect} from 'react'
import "../styles/Management.css";
import NumberInput from '../components/NumberInput';

export const NewProduct = () => {
  const [name, setName] = useState('')
  const [description, serDescription] = useState('')
  const [price, setPrice] = useState('')
  const [code, setCode] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = async (event) => {
    setName('')
    event.preventDefault();

  }

  const handleNameChange = (event) =>
    setName(event.target.value);

  
  const handleDescriptionChange = (event) =>
    serDescription(event.target.value);

  const handlePriceChange = (event) =>
    setPrice(event.target.value);

  
  const handlecodeChange = (event) =>
    setCode(event.target.value);

  const handlecategoryChange = (event) =>
    setCategory(event.target.value);



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
            Descripcion
            <textarea
                className="add_exercise_textarea"
                value={description}
                onChange={handleDescriptionChange}
              ></textarea>
          </div>
        </div>
        <div>
        <div className="add_exercise_rows">
              Codigo
              <input
              type="text"
              className="add_exercise_input"
              value={code}
              onChange={handlecodeChange}
            />
        </div>
          <div className="add_exercise_rows">
            Categoría
            <input
              type="text"
              className="add_exercise_input"
              value={category}
              onChange={handlecategoryChange}
            />
          </div>
        </div>
        </div>      
      <button type="submit" className="add_button">
        Añadir Producto
      </button>
    </form>
  </div>
  )
}
