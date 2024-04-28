import React, { useState, useEffect } from 'react';
import '../../../styles/Management.css';
import NumberInput from '../../NumberInput';
import Dropdown from '../../DropdownCollections';
import config from "../../../utils/conf";

export default function RequestFoodsEdit({ food }) {
    const [FoodName, setFoodName] = useState('');
    const [calories, setFoodCalories] = useState('');
    const [weight, setFoodWeight] = useState('');
    const [category, setFoodCategory] = useState(null); 
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

    useEffect(() => {
        if (food) {
            setFoodName(food.nombre || '');
            setFoodCalories(food.calorias || '');
            setFoodWeight(food.peso || '');
            const categoryObject = categoria.find(c => c.label === food.categoria) || null;
            setFoodCategory(categoryObject);                 
            setFoodCarbohydrates(food.macronutrientes.find(m => m.macronutriente === 'Carbohidratos')?.cantidad || 0);
            setFoodFats(food.macronutrientes.find(m => m.macronutriente === 'Grasas')?.cantidad || 0);
            setFoodProtein(food.macronutrientes.find(m => m.macronutriente === 'Proteinas')?.cantidad || 0);
        }
    }, [food]);

    const handleFoodNameChange = (event) => setFoodName(event.target.value);
    const handleFoodCategoryChange = (event) => setFoodCategory(event.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const regex = /^[a-zA-Z0-9 _\-,\.]+$/;

        // Validación del nombre del alimento
        if (FoodName.length > 50 || !regex.test(FoodName)) {
          alert('El nombre del alimento contiene caracteres no permitidos o es demasiado largo. Debe tener 50 caracteres o menos y solo puede contener letras, números, espacios, guiones, guiones bajos, puntos y comas.');
          return;
        }

        if (!FoodName || !calories || !category || !weight || !carbohydrates || !fats || !protein) {
            alert('Por favor completa todos los campos.');
            return;
        }

        const updateData = {
          ID_Alimento: food.ID_Alimento, // Asegúrate de tener el ID del alimento para actualizar
          nombre: FoodName,
          calorias: parseInt(calories),
          peso: parseFloat(weight),
          ID_Categoria: category.value, // Asumiendo que category es un objeto con un campo value
          macronutrientes: [
            { ID_Macronutriente: 1, cantidad: parseFloat(carbohydrates) }, // Carbohidratos
            { ID_Macronutriente: 2, cantidad: parseFloat(fats) }, // Grasas
            { ID_Macronutriente: 3, cantidad: parseFloat(protein) }  // Proteínas
          ]
        };

        try {
            const response = await fetch(`${config.apiBaseUrl}/alimento/${food.ID_Alimento}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error('Hubo un problema al actualizar el alimento');
            }

            alert('Alimento actualizado con éxito.');
            window.location.reload(); 
        } catch (error) {
            console.error('Error al actualizar el alimento:', error);
            alert('Error al actualizar el alimento.');
        }
    };

    return (
        <div className='container-edit'>
            <form className='form_add_exercise' onSubmit={handleSubmit}>
                <div className='add_exercise_area'>
                    <div>
                        <div className='add_exercise_rows'>
                            ¿Cuál es el nombre del alimento?
                            <input type="text" className='add_exercise_input' value={FoodName} onChange={handleFoodNameChange} />
                        </div>
                        <div className='add_exercise_rows'>
                            ¿Cómo se clasifica?
                            <Dropdown options={categoria} selectedOption={category} onChange={handleFoodCategoryChange} />
                        </div>
                        <div className='add_exercise_rows'>
                            ¿Cuánto pesa? (en gramos)
                            <NumberInput
                                placeholder="…"
                                value={weight}
                                min={0}
                                max={5000}
                                onChange={(event, weight) => setFoodWeight(weight)}
                            />
                        </div>
                        <div className='add_exercise_rows'>
                            ¿Cuántas calorías tiene el alimento?
                            <NumberInput
                                placeholder="…"
                                value={calories}
                                min={0}
                                max={10000}
                                onChange={(event, calories) => setFoodCalories(calories)}
                            />
                        </div>
                    </div>
                    <div>
                        <div className='add_exercise_rows'>
                            ¿Cuántos gramos tiene el alimento de carbohidratos?
                            <NumberInput
                                placeholder="…"
                                value={carbohydrates}
                                min={0}
                                max={5000}
                                onChange={(event, carbohydrates) => setFoodCarbohydrates(carbohydrates)}
                            />
                        </div>
                        <div className='add_exercise_rows'>
                            ¿Cuántos gramos tiene el alimento de proteínas?
                            <NumberInput
                                placeholder="…"
                                value={protein}
                                min={0}
                                max={5000}
                                onChange={(event, protein) => setFoodProtein(protein)}
                            />
                        </div>
                        <div className='add_exercise_rows'>
                            ¿Cuántos gramos tiene el alimento de grasas?
                            <NumberInput
                                placeholder="…"
                                value={fats}
                                min={0}
                                max={5000}
                                onChange={(event, fats) => setFoodFats(fats)}
                            />
                        </div>
                    </div>
                </div>
                <button className='add_button'>Guardar</button>
            </form>
        </div>
    );
}
