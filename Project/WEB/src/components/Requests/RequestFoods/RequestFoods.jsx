import React, { useState, useEffect } from "react";
import SearchBar from "../../SearchBar";
import "../../../styles/Management.css";
import config from "../../../utils/conf";
import RequestFoodsEdit from "./RequestFoodsEdit";
import RequestFoodsAdd from "./RequestFoodsAdd";
import RequestFoodsDelete from "./RequestFoodsDelete";

export default function RequestFoods() {
  const [searchTerm, setSearchTerm] = useState("");
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [addingFood, setAddingFood] = useState(null);
  const [eliminatingFood, setEliminatingFood] = useState(null);
  const [editingFood, setEditingFood] = useState(null);
  const [showAddPage, setShowAddPage] = useState(false);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/alimentorequest`); // Cambiar a la URL correcta
        if (!response.ok)
          throw new Error("No se pudieron obtener los alimentos");
        const data = await response.json();
        setFoods(data);
      } catch (error) {
        console.error("Error al obtener los alimentos:", error);
      }
    };

    fetchFoods();
  }, []);

  const filteredFoods = foods.filter((food) =>
    food.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (food) => {
    if (expandedRow === food.ID_Alimento) {
      setExpandedRow(null);
      setEditingFood(null);
      setAddingFood(null);
      setEliminatingFood(null);
      setSelectedFood(null);
    } else {
      if (editingFood && editingFood.ID_Alimento === food.ID_Alimento) {
        setEditingFood(null);
      }
      setEditingFood(null);
      setAddingFood(null);
      setEliminatingFood(null);
      setExpandedRow(food.ID_Alimento);
      setSelectedFood(food);
    }
  };

  const handleEditClick = (food) => {
    if (editingFood && editingFood.ID_Alimento === food.ID_Alimento) {
      setEditingFood(null);
    } else {
      if (expandedRow && expandedRow !== food.ID_Alimento) {
        setExpandedRow(null);
        setSelectedFood(null);
        setAddingFood(null);
        setEliminatingFood(null);
      }
      setExpandedRow(null);
      setSelectedFood(null);
      setEliminatingFood(null);
      setAddingFood(null);
      setEditingFood(food);
    }
  };

  const handleAddClick = (food) => {
    if (addingFood && addingFood.ID_Alimento === food.ID_Alimento) {
      setAddingFood(null);
    } else {
      if (expandedRow && expandedRow !== food.ID_Alimento) {
        setExpandedRow(null);
        setSelectedFood(null);
        setAddingFood(null);
        setEditingFood(null);
        setEliminatingFood(null);
      }
      setExpandedRow(null);
      setSelectedFood(null);
      setEditingFood(null);
      setEliminatingFood(null);
      setAddingFood(food);
    }
  };

  const handleDeleteClick = (food) => {
    if (eliminatingFood && eliminatingFood.ID_Alimento === food.ID_Alimento) {
      setEliminatingFood(null);
    } else {
      if (expandedRow && expandedRow !== food.ID_Alimento) {
        setExpandedRow(null);
        setSelectedFood(null);
        setAddingFood(null);
        setEditingFood(null);
      }
      setExpandedRow(null);
      setSelectedFood(null);
      setAddingFood(null);
      setEditingFood(null);
      setEliminatingFood(food);
    }
  };

  const handleBackToList = () => {
    setShowAddPage(false);
  };

  if (showAddPage) {
    return <RequestFoodsAdd onBackToList={handleBackToList} />;
  }

  return (
    <div className="container2">
      <ul className="cardcontainer">
        {filteredFoods.map((food) => (
          <li
            key={food.ID_Alimento}
            className={`row ${
              (selectedFood && selectedFood.ID_Alimento === food.ID_Alimento) ||
              (editingFood && editingFood.ID_Alimento === food.ID_Alimento) ||
              (addingFood && addingFood.ID_Alimento === food.ID_Alimento) ||
              (eliminatingFood &&
                eliminatingFood.ID_Alimento === food.ID_Alimento)
                ? "selected"
                : ""
            }`}
          >
            <div
              onClick={() => handleRowClick(food)}
              className={`row_header ${
                (selectedFood &&
                  selectedFood.ID_Alimento === food.ID_Alimento) ||
                (editingFood && editingFood.ID_Alimento === food.ID_Alimento) ||
                (addingFood && addingFood.ID_Alimento === food.ID_Alimento) ||
                (eliminatingFood &&
                  eliminatingFood.ID_Alimento === food.ID_Alimento)
                  ? "selected"
                  : ""
              }`}
            >
              <div>
                <div className="row_name">{food.nombre}</div>
                <div className="row_description">{food.categoria}</div>
              </div>
              <div className="row_buttons">
                <div className="row_edit">
                  <i
                    className={`bi bi-database-add card-icon ${
                      addingFood && addingFood.ID_Alimento === food.ID_Alimento
                        ? "selected"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddClick(food);
                    }}
                  ></i>
                </div>
                <div className="row_edit">
                  <i
                    className={`bi bi-trash card-icon ${
                      eliminatingFood &&
                      eliminatingFood.ID_Alimento === food.ID_Alimento
                        ? "selected"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(food);
                    }}
                  ></i>
                </div>
                <div className="row_edit">
                  <i
                    className={`bi bi-pencil-square card-icon ${
                      editingFood &&
                      editingFood.ID_Alimento === food.ID_Alimento
                        ? "selected"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(food);
                    }}
                  ></i>
                </div>
              </div>
            </div>
            {expandedRow === food.ID_Alimento && (
              <>
                <div className="exercise-info">
                  <div className="exercise-info-column">
                    <div className="exercise-info-row">
                      Peso: {food.peso} gramos
                    </div>
                    <div className="exercise-info-row">
                      Calorias totales: {food.calorias} kcal
                    </div>
                  </div>
                  <div className="exercise-info-column">
                    <div className="exercise-info-row">
                      Carbohidratos:{" "}
                      {food.macronutrientes.find(
                        (m) => m.macronutriente === "Carbohidratos"
                      )?.cantidad || 0}{" "}
                      kcal
                    </div>
                    <div className="exercise-info-row">
                      Proteína:{" "}
                      {food.macronutrientes.find(
                        (m) => m.macronutriente === "Proteinas"
                      )?.cantidad || 0}{" "}
                      kcal
                    </div>
                    <div className="exercise-info-row">
                      Grasa:{" "}
                      {food.macronutrientes.find(
                        (m) => m.macronutriente === "Grasas"
                      )?.cantidad || 0}{" "}
                      kcal
                    </div>
                  </div>
                </div>
              </>
            )}
            {addingFood && addingFood.ID_Alimento === food.ID_Alimento && (
              <>
                <RequestFoodsAdd food={addingFood} />
              </>
            )}
            {eliminatingFood &&
              eliminatingFood.ID_Alimento === food.ID_Alimento && (
                <>
                  <RequestFoodsDelete food={eliminatingFood} />
                </>
              )}
            {editingFood && editingFood.ID_Alimento === food.ID_Alimento && (
              <>
                <RequestFoodsEdit food={editingFood} />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
