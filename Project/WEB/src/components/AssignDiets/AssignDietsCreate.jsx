import React, { useState, useEffect } from "react";
import { FoodCard } from "../DATA_FOOD";
import { RecipeCard } from "../DATA_RECIPES";
import Dropdown from "../DropdownCollections2";
import NumberInput from "../NumberInput";
import { useMsal } from "@azure/msal-react";
import { ToolTipInfo } from "../ToolTipInfo";
import config from "../../utils/conf";

export default function AssignDietsCreate({ client, onDietCreate }) {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();


  const [tiemposComida, setTiemposComida] = useState([]);
  const [foodAndRecipeOptions, setFoodAndRecipeOptions] = useState([]);


  useEffect(() => {
    const fetchMealTimes = async () => {
      const mealTimesData = await getMealTimesFromAPI();
      const mealTimesOptions = mealTimesData.map((time) => ({
        label: time.tiempo, // Usamos 'tiempo' como el texto que se mostrará en el dropdown
        value: time.ID_TiempoComida, // Usamos 'ID_TiempoComida' como el valor que se seleccionará
      }));
      console.log(mealTimesOptions);
      setTiemposComida(mealTimesOptions);
    };

    fetchMealTimes();
  }, []);

  const handleMealTimeChange = (dayIndex, mealIndex, selectedOption) => {
    if (selectedOption) {
      setDietPlan(currentDietPlan => {
        const newDietPlan = { ...currentDietPlan };
        // Aquí asumimos que days es un array y meals también es un array dentro de cada day
        newDietPlan.days[dayIndex].meals[mealIndex].mealTimeId = selectedOption.value;
        
        // Esto crea una nueva referencia para days y meals, asegurando que React detecte el cambio
        newDietPlan.days = [...newDietPlan.days];
        newDietPlan.days[dayIndex] = { ...newDietPlan.days[dayIndex], meals: [...newDietPlan.days[dayIndex].meals] };
        
        return newDietPlan; // Retorna el nuevo estado
      });
    }
  };
  
  

  useEffect(() => {
    const fetchFoodAndRecipes = async () => {
      try {
        const url = `${config.apiBaseUrl}/comidasRecetas`; // Ajusta según sea necesario
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("La solicitud a la API falló");
        }
  
        const data = await response.json();
        const options = data.map((item) => {
          // Diferenciar entre 'Alimento' y 'Receta' para ajustar el label y el value correctamente
          if (item.type === 'Alimento') {
            return {
              label: `Alimento: ${item.nombre}`,
              value: `A-${item.ID_Alimento}` // Prefijo 'A-' para diferenciar Alimento
            };
          } else { // Asume que el otro tipo es 'Receta'
            return {
              label: `Receta: ${item.receta}`,
              value: `R-${item.ID_Receta}` // Prefijo 'R-' para diferenciar Receta
            };
          }
        });

        console.log(options);
        setFoodAndRecipeOptions(options);
      } catch (error) {
        console.error("Error al obtener alimentos y recetas:", error);
      }
    };
  
    fetchFoodAndRecipes();
  }, []);
  


  async function getMealTimesFromAPI() {
    try {
      // URL de tu API que devuelve los tiempos de comida
      const url = `${config.apiBaseUrl}/tiemposComida`;
      const response = await fetch(url, {
        method: "GET", // Método HTTP
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Manejo de respuestas no exitosas
        throw new Error("La solicitud a la API falló");
      }

      const data = await response.json(); // Suponiendo que la API devuelve un JSON
      return data; // Devuelve los datos obtenidos
    } catch (error) {
      console.error("Error al obtener los tiempos de comida:", error);
      return []; // Devuelve un array vacío en caso de error
    }
  }

  useEffect(() => {
    if (activeAccount && activeAccount.idTokenClaims.oid) {
      setDietPlan((prevState) => ({
        ...prevState,
        nutritionistId: activeAccount.idTokenClaims.oid
          ? activeAccount.idTokenClaims.oid
          : null,
      }));
    }
  }, []);

  const [dietPlan, setDietPlan] = useState({
    nutritionistId: client.ID_Usuario, //ID del entrenador
    clientId: client.ID_Usuario, // Se inicializa sin un ID específico
    name: null,
    totalKcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    startDate: null,
    endDate: null,
    days: [
      { day: "Lunes", meals: [] },
      { day: "Martes", meals: [] },
      { day: "Miércoles", meals: [] },
      { day: "Jueves", meals: [] },
      { day: "Viernes", meals: [] },
      { day: "Sábado", meals: [] },
      { day: "Domingo", meals: [] },
    ],
  });

  // Actualiza dietPlan cuando cambia el cliente seleccionado
  useEffect(() => {
    setDietPlan((prevState) => ({
      ...prevState,
      clientId: client.ID_Usuario, // Actualiza el clientId con el nuevo cliente seleccionado
      // Reinicia otros valores si es necesario
      name: null,
      totalKcal: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      startDate: null,
      endDate: null,
      days: prevState.days.map((day) => ({ ...day, meals: [] })), // Reinicia las comidas para cada día
    }));
  }, [client]);

  const addMeal = (dayOfWeek, mealName) => {
    const updatedDietPlan = { ...dietPlan };

    const dayIndex = updatedDietPlan.days.findIndex(
      (day) => day.day === dayOfWeek
    );

    if (dayIndex > -1) {
      const newMeal = { mealName, foods: [] };

      updatedDietPlan.days[dayIndex].meals.push(newMeal);

      setDietPlan(updatedDietPlan);
    }
  };

  const removeMeal = (dayOfWeek, mealIndex) => {
    const updatedDietPlan = { ...dietPlan };

    const dayIndex = updatedDietPlan.days.findIndex(
      (day) => day.day === dayOfWeek
    );

    if (
      dayIndex > -1 &&
      mealIndex >= 0 &&
      mealIndex < updatedDietPlan.days[dayIndex].meals.length
    ) {
      updatedDietPlan.days[dayIndex].meals.splice(mealIndex, 1);
      setDietPlan(updatedDietPlan);
    }
  };

  const handleFoodOrRecipeSelection = (dayIndex, mealIndex, foodIndex, selectedOption) => {
    if (selectedOption) {
      setDietPlan(currentDietPlan => {
        const newDietPlan = { ...currentDietPlan };
        newDietPlan.days[dayIndex].meals[mealIndex].foods[foodIndex].selectedFoodOrRecipeId = selectedOption.value;
  
        // Crea una nueva referencia para days, meals y foods, asegurando que React detecte el cambio
        newDietPlan.days = [...newDietPlan.days];
        newDietPlan.days[dayIndex] = { ...newDietPlan.days[dayIndex], meals: [...newDietPlan.days[dayIndex].meals] };
        newDietPlan.days[dayIndex].meals[mealIndex] = { ...newDietPlan.days[dayIndex].meals[mealIndex], foods: [...newDietPlan.days[dayIndex].meals[mealIndex].foods] };
  
        return newDietPlan;
      });
    }
  };

  const handleMealNameChange = (dayOfWeek, mealIndex, newName) => {
    const updatedDietPlan = { ...dietPlan };

    const dayIndex = updatedDietPlan.days.findIndex(
      (day) => day.day === dayOfWeek
    );
    if (
      dayIndex > -1 &&
      mealIndex >= 0 &&
      mealIndex < updatedDietPlan.days[dayIndex].meals.length
    ) {
      updatedDietPlan.days[dayIndex].meals[mealIndex].mealName = newName;

      setDietPlan(updatedDietPlan);
    }
  };

  const handleDietNameChange = (event) => {
    setDietPlan({
      ...dietPlan,
      name: event.target.value,
    });
  };

  const handleFoodChange = (
    dayIndex,
    mealIndex,
    foodIndex,
    field,
    newValue
  ) => {
    const newDietPlan = { ...dietPlan };
    newDietPlan.days = newDietPlan.days.map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          meals: day.meals.map((meal, mIndex) => {
            if (mIndex === mealIndex) {
              return {
                ...meal,
                foods: meal.foods.map((food, fIndex) => {
                  if (fIndex === foodIndex) {
                    return { ...food, [field]: newValue };
                  }
                  return food;
                }),
              };
            }
            return meal;
          }),
        };
      }
      return day;
    });
    setDietPlan(newDietPlan);
  };

  const addFoodToMeal = (dayOfWeek, mealIndex, newFood) => {
    setDietPlan(currentDietPlan => {
      const newDietPlan = { ...currentDietPlan };
      const dayIndex = newDietPlan.days.findIndex(day => day.day === dayOfWeek);
  
      if (dayIndex !== -1) {
        // Crea una copia del alimento con estructura adecuada si es necesario
        const foodToAdd = { ...newFood, name: newFood.name || 'Nuevo Alimento', portion: newFood.portion || 0 };
  
        // Añade el alimento a la comida especificada
        const meals = [...newDietPlan.days[dayIndex].meals];
        meals[mealIndex].foods = [...meals[mealIndex].foods, foodToAdd];
  
        // Actualiza el plan de dieta con el nuevo estado
        newDietPlan.days[dayIndex].meals = meals;
      }
  
      return newDietPlan;
    });
  };
  
  const removeFoodFromMeal = (dayOfWeek, mealIndex, foodIndex) => {
    setDietPlan(currentDietPlan => {
      const newDietPlan = { ...currentDietPlan };
      const dayIndex = newDietPlan.days.findIndex(day => day.day === dayOfWeek);
  
      if (dayIndex !== -1 && mealIndex < newDietPlan.days[dayIndex].meals.length && foodIndex < newDietPlan.days[dayIndex].meals[mealIndex].foods.length) {
        // Remueve el alimento especificado de la comida
        const foods = [...newDietPlan.days[dayIndex].meals[mealIndex].foods];
        foods.splice(foodIndex, 1);
  
        // Actualiza el plan de dieta con el nuevo estado
        newDietPlan.days[dayIndex].meals[mealIndex].foods = foods;
      }
  
      return newDietPlan;
    });
  };
  

  useEffect(() => {
    onDietCreate(dietPlan);
  }, [dietPlan, onDietCreate]);

  return (
    <div className="cardcontainer-diet">
      <div className="center-form">
        Nombre de la dieta:
        <input
          type="text"
          className="add_exercise_input"
          value={dietPlan.name}
          onChange={handleDietNameChange}
        ></input>
      </div>
      {dietPlan.days.map((day, dayIndex) => (
  <div key={dayIndex} className="day-container-diet">
    <div className="day-title">{day.day}</div>
    <div className="routine-area-add">
      <button
        className="btn-add-exercise"
        onClick={() => addMeal(day.day, null)}
      >
        <i className="bi bi-plus-circle add-routine-icon"></i> Añadir Comida
      </button>
    </div>
    {day.meals.map((meal, mealIndex) => (
      <>
        <div
          key={`${dayIndex}-${mealIndex}`}
          className={`diet-meal-header ${
            mealIndex % 2 === 0 ? "day-even" : "day-odd"
          }`}
        >
          <Dropdown
            key={`${dayIndex}-${mealIndex}`}
            options={tiemposComida}
            selectedOption={tiemposComida.find(
              (option) => option.value === meal.mealTimeId
            )}
            onChange={(selectedOption) =>
              handleMealTimeChange(dayIndex, mealIndex, selectedOption)
            }
          />
          <div className="row_buttons">
            <button
              onClick={() => addFoodToMeal(day.day, mealIndex, { name: "", portion: 0 })}
              className="btn-add-meal"
            >
              <i className="bi bi-plus-circle recipe-icon"></i> Añadir Alimento
            </button>
            <button
              onClick={() => removeMeal(day.day, mealIndex)}
              className="btn-remove-meal"
            >
              <i className="bi bi-trash recipe-icon"></i> Comida
            </button>
          </div>
        </div>
        {meal.foods.map((food, foodIndex) => (
          <div
            key={`${dayIndex}-${mealIndex}-${foodIndex}`}
            className={`meal-food-container ${
              foodIndex % 2 === 0 ? "day-even" : "day-odd"
            }`}
          >
            <Dropdown
              key={`${dayIndex}-${mealIndex}-${foodIndex}-food`}
              options={foodAndRecipeOptions}
              selectedOption={foodAndRecipeOptions.find(
                (option) => option.value === food.selectedFoodOrRecipeId
              )}
              onChange={(selectedOption) =>
                handleFoodOrRecipeSelection(dayIndex, mealIndex, foodIndex, selectedOption)
              }
              placeholder="Seleccione Alimento o Receta"
            />
            <div className="align-center">
              <div>
                Porción{" "}
                <ToolTipInfo
                  message={
                    "Indique la cantidad de la porción, por ejemplo, para un vaso de leche, especifique en mililitros; para carne, indique el peso en gramos; para una pieza de fruta, mencione la unidad o cantidad específica, y así para otros alimentos."
                  }
                >
                  <i className="bi bi-info-circle-fill info-icon" />
                </ToolTipInfo>
              </div>
              <NumberInput
                placeholder="…"
                value={Number(food.portion)}
                min={0}
                max={500}
                step={0.25}
                onChange={(e, newPortion) => {
                  handleFoodChange(
                    dayIndex,
                    mealIndex,
                    foodIndex,
                    "portion",
                    Number(newPortion)
                  );
                }}
              />
            </div>
            <i
              className={`bi bi-trash meal-icon`}
              onClick={() => removeFoodFromMeal(day.day, mealIndex, foodIndex)}
            ></i>
          </div>
        ))}
      </>
    ))}
  </div>
))}
    </div>
  );
}
