import React, { useState} from 'react';
import '../../../styles/Management.css';
import NumberInput from '../../NumberInput';
import Dropdown from '../../DropdownCollections';
import config from "../../../utils/conf";

export default function PrimaryFoodAdd({ onBackToList }) {

    const [FoodName, setFoodName] = useState('');
    const [calories, setFoodCalories] = useState('');
    const [weight, setFoodWeight] = useState('');
    const [category, setFoodCategory] = useState(null); // o useState({});
    const [carbohydrates, setFoodCarbohydrates] = useState('');
    const [fats, setFoodFats] = useState('');
    const [protein, setFoodProtein] = useState('');


    const categoria = [
      { label: "Lacteo", value: 1 },
      { label: "Granos", value: 2 },
      { label: "Fruta", value: 3 },
      { label: "Verdura", value: 4 },
      { label: "Proteina", value: 5 },
      { label: "Snack", value: 6 },
    ];

  const handleFoodNameChange = (event) => setFoodName(event.target.value);

  const handleFoodCategoryChange = (selectedOption) => {
    setFoodCategory(selectedOption ?? null); // Ajusta para manejar un objeto de opción o nullificar
    console.log(selectedOption);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!FoodName || !calories || !category || !weight || !carbohydrates || !fats || !protein) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const alimentoData = {
      nombre: FoodName,
      calorias: parseInt(calories, 10),
      peso: parseFloat(weight),
      ID_Categoria: category.value,
      macronutrientes: [
        { ID_Macronutriente: 1, cantidad: parseFloat(fats)},
        { ID_Macronutriente: 2, cantidad: parseFloat(carbohydrates)}, 
        { ID_Macronutriente: 3, cantidad: parseFloat(protein)}, 
      ],
    };

    console.log(category);
    console.log(alimentoData);

    try {
      const response = await fetch(`${config.apiBaseUrl}/alimentorequest`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alimentoData),
      });

      if (!response.ok) {
        throw new Error('Error al crear alimento');
      }
      
      const result = await response.json();
      console.log(result);
      alert('Alimento solicitado con éxito.');
      onBackToList(); // Regresa a la lista de alimentos
    } catch (error) {
      console.error('Error al guardar el alimento:', error);
      alert('Error al guardar el alimento.');
    }
  };


  return (
<div className='container2'>
      <div className='add_header2'>
        <button className="back_icon card-icon" onClick={onBackToList}><i className="bi bi-arrow-left"></i> </button>
        <h1 className='mtitle'>Solicitar un alimento nuevo</h1>
      </div>
      <form className='form_add_exercise' onSubmit={handleSubmit}>
        <div className='add_exercise_area'>
          <div>
            <div className='add_exercise_rows'>
              ¿Cuál es el nombre del alimento? 
              <input type="text" className='add_exercise_input' value={FoodName} onChange={handleFoodNameChange}  />
            </div>
            <div className='add_exercise_rows'>
              ¿Cómo se clasifica? <Dropdown options={categoria} selectedOption={category} onChange={handleFoodCategoryChange}  />
            </div>
            <div className='add_exercise_rows'>
            ¿Cuánto pesa? {"(en gramos)"}
            <NumberInput
                placeholder="…"
                value={Number(weight)}
                min={0}
                max={5000}
                onChange={(event, weight) => setFoodWeight(weight)}
                />
            </div>
            <div className='add_exercise_rows'>
              ¿Cúantas calorias tiene el alimento?
              <NumberInput
                placeholder="…"
                value={Number(calories)}
                min={0}
                max={5000}
                onChange={(event, calories) => setFoodCalories(calories)}
                />
            </div>
          </div>
          <div>
            <div className='add_exercise_rows'>
            ¿Cúantos gramos tiene el alimento de carbohidratos?
                <NumberInput
                placeholder="…"
                value={Number(carbohydrates)}
                min={0}
                max={5000}
                onChange={(event, carbohydrates) => setFoodCarbohydrates(carbohydrates)}
                />
            </div>
            <div className='add_exercise_rows'>
            ¿Cúantos gramos tiene el alimento de proteínas? 
            <NumberInput
                placeholder="…"
                value={Number(protein)}
                min={0}
                max={5000}
                onChange={(event, protein) => setFoodProtein(protein)}
                />
            </div>
              <div className='add_exercise_rows'>
              ¿Cúantas calorías tiene el alimento de grasas? 
              <NumberInput
                placeholder="…"
                value={Number(fats)}
                min={0}
                max={5000}
                onChange={(event, fats) => setFoodFats(fats)}
                />
              </div>
          </div>
        </div>
        <button className='add_button'>Agregar alimento</button>
      </form>
    </div>
  )
}


