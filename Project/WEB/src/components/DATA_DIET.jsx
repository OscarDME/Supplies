export const DATA_DIET = [
  {
    id: 1,
    assignedBy: 1,//Id del nutricionista
    assignedTo: 1203, //Id del cliente
    name: 'Dieta equilibrada',
    totalCalories: 2000,
    proteinCalories: 1000,
    carbohydrates: 300,
    fats:700,
    begginingDate: new Date(),
    finishingDate: new Date(),
    days: [
        {
            day:{
                id:1,
                day:"Lunes",
                completed: false,
            },
            id:1,
            meals:[
                {
                    id: 12,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 1,
                            completed: false,
                            quantity:1, //Si es una receta, significa que la porcion de la receta sera esta proporcion ej(1.5 sandwich)
                            food:{
                                id:"3",
                                weight:"150",
                                name:"Jamón",
                                category:"Proteina",
                                calories:"209",
                                protein:"8",
                                carbohydrates:"192",
                                fats:"9"     
                            }
                        }
                    ]
                },
                {
                    id: 13,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 3,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 4,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 14,
                    meal:"Cena",
                    completed: false,
                    foods:[
                        {
                            id: 5,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 6,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:2,
                day:"Martes",
                completed: false,
            },
            id:2,
            meals:[
                {
                    id: 15,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 7,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 16,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 8,
                            quantity: 1,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                    ]
                }
            ]
        },
        {
            day:{
                id:3,
                day:"Miércoles",
                completed: false,
            },
            meals:[
                {
                    id: 17,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 9,
                            quantity: 1,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 10,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:4,
                day:"Jueves",
                completed: false,
            },
            meals:[
                {
                    id: 18,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 11,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 19,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 12,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:5,
                day:"Viernes",
                completed: false,
            },
            meals:[
                {
                    id: 20,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 13,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "7",
                                weight: "150",
                                name: "Huevo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 21,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 14,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "3",
                                weight: "150",
                                name: "Arroz",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },{
            day:{
                id:6,
                day:"Sábado",
                completed: false,
            },
            meals:[
                {
                    id: 22,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 15,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Pan",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 23,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 16,
                            quantity: 1,
                            food: {
                                id: "8",
                                weight: "150",
                                name: "Pescado",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:7,
                day:"Domingo",
                completed: false,
            },
            meals:[
                {
                    id: 24,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 17,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "100",
                                protein: "2",
                                carbohydrates: "25",
                                fats: "1"
                            }
                        }
                    ]
                },
                {
                    id: 25,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 18,
                            quantity: 1,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Sandía",
                                category: "Fruta",
                                calories: "80",
                                protein: "1",
                                carbohydrates: "20",
                                fats: "0"
                            }
                        }
                    ]
                }
            ]
        }
    ]
  }, {
    id: 1,
    assignedBy: 1,//Id del nutricionista
    assignedTo: 1203, //Id del cliente
    name: 'Dieta equilibrada',
    totalCalories: 2000,
    proteinCalories: 1000,
    carbohydrates: 300,
    fats:700,
    begginingDate: new Date(),
    finishingDate: new Date(),
    days: [
        {
            day:{
                id:1,
                day:"Lunes",
                completed: false,
            },
            id:1,
            meals:[
                {
                    id: 12,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 1,
                            completed: false,
                            quantity:1, //Si es una receta, significa que la porcion de la receta sera esta proporcion ej(1.5 sandwich)
                            food:{
                                id:"3",
                                weight:"150",
                                name:"Jamón",
                                category:"Proteina",
                                calories:"209",
                                protein:"8",
                                carbohydrates:"192",
                                fats:"9"     
                            }
                        }
                    ]
                },
                {
                    id: 13,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 3,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 4,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 14,
                    meal:"Cena",
                    completed: false,
                    foods:[
                        {
                            id: 5,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 6,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:2,
                day:"Martes",
                completed: false,
            },
            id:2,
            meals:[
                {
                    id: 15,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 7,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 16,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 8,
                            quantity: 1,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                    ]
                }
            ]
        },
        {
            day:{
                id:3,
                day:"Miércoles",
                completed: false,
            },
            meals:[
                {
                    id: 17,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 9,
                            quantity: 1,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 10,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:4,
                day:"Jueves",
                completed: false,
            },
            meals:[
                {
                    id: 18,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 11,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 19,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 12,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:5,
                day:"Viernes",
                completed: false,
            },
            meals:[
                {
                    id: 20,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 13,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "7",
                                weight: "150",
                                name: "Huevo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 21,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 14,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "3",
                                weight: "150",
                                name: "Arroz",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },{
            day:{
                id:6,
                day:"Sábado",
                completed: false,
            },
            meals:[
                {
                    id: 22,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 15,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Pan",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 23,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 16,
                            quantity: 1,
                            food: {
                                id: "8",
                                weight: "150",
                                name: "Pescado",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:7,
                day:"Domingo",
                completed: false,
            },
            meals:[
                {
                    id: 24,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 17,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "100",
                                protein: "2",
                                carbohydrates: "25",
                                fats: "1"
                            }
                        }
                    ]
                },
                {
                    id: 25,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 18,
                            quantity: 1,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Sandía",
                                category: "Fruta",
                                calories: "80",
                                protein: "1",
                                carbohydrates: "20",
                                fats: "0"
                            }
                        }
                    ]
                }
            ]
        }
    ]
  }, {
    id: 1,
    assignedBy: 1,//Id del nutricionista
    assignedTo: 1203, //Id del cliente
    name: 'Dieta equilibrada',
    totalCalories: 2000,
    proteinCalories: 1000,
    carbohydrates: 300,
    fats:700,
    begginingDate: new Date(),
    finishingDate: new Date(),
    days: [
        {
            day:{
                id:1,
                day:"Lunes",
                completed: false,
            },
            id:1,
            meals:[
                {
                    id: 12,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 1,
                            completed: false,
                            quantity:1, //Si es una receta, significa que la porcion de la receta sera esta proporcion ej(1.5 sandwich)
                            food:{
                                id:"3",
                                weight:"150",
                                name:"Jamón",
                                category:"Proteina",
                                calories:"209",
                                protein:"8",
                                carbohydrates:"192",
                                fats:"9"     
                            }
                        }
                    ]
                },
                {
                    id: 13,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 3,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 4,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 14,
                    meal:"Cena",
                    completed: false,
                    foods:[
                        {
                            id: 5,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 6,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:2,
                day:"Martes",
                completed: false,
            },
            id:2,
            meals:[
                {
                    id: 15,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 7,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 16,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 8,
                            quantity: 1,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                    ]
                }
            ]
        },
        {
            day:{
                id:3,
                day:"Miércoles",
                completed: false,
            },
            meals:[
                {
                    id: 17,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 9,
                            quantity: 1,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 10,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:4,
                day:"Jueves",
                completed: false,
            },
            meals:[
                {
                    id: 18,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 11,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 19,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 12,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:5,
                day:"Viernes",
                completed: false,
            },
            meals:[
                {
                    id: 20,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 13,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "7",
                                weight: "150",
                                name: "Huevo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 21,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 14,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "3",
                                weight: "150",
                                name: "Arroz",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },{
            day:{
                id:6,
                day:"Sábado",
                completed: false,
            },
            meals:[
                {
                    id: 22,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 15,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Pan",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 23,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 16,
                            quantity: 1,
                            food: {
                                id: "8",
                                weight: "150",
                                name: "Pescado",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:7,
                day:"Domingo",
                completed: false,
            },
            meals:[
                {
                    id: 24,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 17,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "100",
                                protein: "2",
                                carbohydrates: "25",
                                fats: "1"
                            }
                        }
                    ]
                },
                {
                    id: 25,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 18,
                            quantity: 1,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Sandía",
                                category: "Fruta",
                                calories: "80",
                                protein: "1",
                                carbohydrates: "20",
                                fats: "0"
                            }
                        }
                    ]
                }
            ]
        }
    ]
  }, {
    id: 1,
    assignedBy: 1,//Id del nutricionista
    assignedTo: 1203, //Id del cliente
    name: 'Dieta equilibrada',
    totalCalories: 2000,
    proteinCalories: 1000,
    carbohydrates: 300,
    fats:700,
    begginingDate: new Date(),
    finishingDate: new Date(),
    days: [
        {
            day:{
                id:1,
                day:"Lunes",
                completed: false,
            },
            id:1,
            meals:[
                {
                    id: 12,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 1,
                            completed: false,
                            quantity:1, //Si es una receta, significa que la porcion de la receta sera esta proporcion ej(1.5 sandwich)
                            food:{
                                id:"3",
                                weight:"150",
                                name:"Jamón",
                                category:"Proteina",
                                calories:"209",
                                protein:"8",
                                carbohydrates:"192",
                                fats:"9"     
                            }
                        }
                    ]
                },
                {
                    id: 13,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 3,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 4,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 14,
                    meal:"Cena",
                    completed: false,
                    foods:[
                        {
                            id: 5,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 6,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:2,
                day:"Martes",
                completed: false,
            },
            id:2,
            meals:[
                {
                    id: 15,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 7,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 16,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 8,
                            quantity: 1,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                    ]
                }
            ]
        },
        {
            day:{
                id:3,
                day:"Miércoles",
                completed: false,
            },
            meals:[
                {
                    id: 17,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 9,
                            quantity: 1,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 10,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:4,
                day:"Jueves",
                completed: false,
            },
            meals:[
                {
                    id: 18,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 11,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 19,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 12,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:5,
                day:"Viernes",
                completed: false,
            },
            meals:[
                {
                    id: 20,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 13,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "7",
                                weight: "150",
                                name: "Huevo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 21,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 14,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "3",
                                weight: "150",
                                name: "Arroz",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },{
            day:{
                id:6,
                day:"Sábado",
                completed: false,
            },
            meals:[
                {
                    id: 22,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 15,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Pan",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 23,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 16,
                            quantity: 1,
                            food: {
                                id: "8",
                                weight: "150",
                                name: "Pescado",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:7,
                day:"Domingo",
                completed: false,
            },
            meals:[
                {
                    id: 24,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 17,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "100",
                                protein: "2",
                                carbohydrates: "25",
                                fats: "1"
                            }
                        }
                    ]
                },
                {
                    id: 25,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 18,
                            quantity: 1,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Sandía",
                                category: "Fruta",
                                calories: "80",
                                protein: "1",
                                carbohydrates: "20",
                                fats: "0"
                            }
                        }
                    ]
                }
            ]
        }
    ]
  },
  {
    id: 1,
    assignedBy: 1,//Id del nutricionista
    assignedTo: 1203, //Id del cliente
    name: 'Dieta equilibrada',
    totalCalories: 2000,
    proteinCalories: 1000,
    carbohydrates: 300,
    fats:700,
    begginingDate: new Date(),
    finishingDate: new Date(),
    days: [
        {
            day:{
                id:1,
                day:"Lunes",
                completed: false,
            },
            id:1,
            meals:[
                {
                    id: 12,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 1,
                            completed: false,
                            quantity:1, //Si es una receta, significa que la porcion de la receta sera esta proporcion ej(1.5 sandwich)
                            food:{
                                id:"3",
                                weight:"150",
                                name:"Jamón",
                                category:"Proteina",
                                calories:"209",
                                protein:"8",
                                carbohydrates:"192",
                                fats:"9"     
                            }
                        }
                    ]
                },
                {
                    id: 13,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 3,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 4,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 14,
                    meal:"Cena",
                    completed: false,
                    foods:[
                        {
                            id: 5,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 6,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:2,
                day:"Martes",
                completed: false,
            },
            id:2,
            meals:[
                {
                    id: 15,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 7,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 16,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 8,
                            quantity: 1,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                    ]
                }
            ]
        },
        {
            day:{
                id:3,
                day:"Miércoles",
                completed: false,
            },
            meals:[
                {
                    id: 17,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 9,
                            quantity: 1,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 10,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:4,
                day:"Jueves",
                completed: false,
            },
            meals:[
                {
                    id: 18,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 11,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 19,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 12,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:5,
                day:"Viernes",
                completed: false,
            },
            meals:[
                {
                    id: 20,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 13,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "7",
                                weight: "150",
                                name: "Huevo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 21,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 14,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "3",
                                weight: "150",
                                name: "Arroz",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },{
            day:{
                id:6,
                day:"Sábado",
                completed: false,
            },
            meals:[
                {
                    id: 22,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 15,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Pan",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 23,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 16,
                            quantity: 1,
                            food: {
                                id: "8",
                                weight: "150",
                                name: "Pescado",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:7,
                day:"Domingo",
                completed: false,
            },
            meals:[
                {
                    id: 24,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 17,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "100",
                                protein: "2",
                                carbohydrates: "25",
                                fats: "1"
                            }
                        }
                    ]
                },
                {
                    id: 25,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 18,
                            quantity: 1,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Sandía",
                                category: "Fruta",
                                calories: "80",
                                protein: "1",
                                carbohydrates: "20",
                                fats: "0"
                            }
                        }
                    ]
                }
            ]
        }
    ]
  },
  {
    id: 1,
    assignedBy: 1,//Id del nutricionista
    assignedTo: 1203, //Id del cliente
    name: 'Dieta equilibrada',
    totalCalories: 2000,
    proteinCalories: 1000,
    carbohydrates: 300,
    fats:700,
    begginingDate: new Date(),
    finishingDate: new Date(),
    days: [
        {
            day:{
                id:1,
                day:"Lunes",
                completed: false,
            },
            id:1,
            meals:[
                {
                    id: 12,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 1,
                            completed: false,
                            quantity:1, //Si es una receta, significa que la porcion de la receta sera esta proporcion ej(1.5 sandwich)
                            food:{
                                id:"3",
                                weight:"150",
                                name:"Jamón",
                                category:"Proteina",
                                calories:"209",
                                protein:"8",
                                carbohydrates:"192",
                                fats:"9"     
                            }
                        }
                    ]
                },
                {
                    id: 13,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 3,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 4,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 14,
                    meal:"Cena",
                    completed: false,
                    foods:[
                        {
                            id: 5,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 6,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:2,
                day:"Martes",
                completed: false,
            },
            id:2,
            meals:[
                {
                    id: 15,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 7,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 16,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 8,
                            quantity: 1,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                    ]
                }
            ]
        },
        {
            day:{
                id:3,
                day:"Miércoles",
                completed: false,
            },
            meals:[
                {
                    id: 17,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 9,
                            quantity: 1,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 10,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:4,
                day:"Jueves",
                completed: false,
            },
            meals:[
                {
                    id: 18,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 11,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 19,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 12,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:5,
                day:"Viernes",
                completed: false,
            },
            meals:[
                {
                    id: 20,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 13,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "7",
                                weight: "150",
                                name: "Huevo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 21,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 14,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "3",
                                weight: "150",
                                name: "Arroz",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },{
            day:{
                id:6,
                day:"Sábado",
                completed: false,
            },
            meals:[
                {
                    id: 22,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 15,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Pan",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 23,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 16,
                            quantity: 1,
                            food: {
                                id: "8",
                                weight: "150",
                                name: "Pescado",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:7,
                day:"Domingo",
                completed: false,
            },
            meals:[
                {
                    id: 24,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 17,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "100",
                                protein: "2",
                                carbohydrates: "25",
                                fats: "1"
                            }
                        }
                    ]
                },
                {
                    id: 25,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 18,
                            quantity: 1,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Sandía",
                                category: "Fruta",
                                calories: "80",
                                protein: "1",
                                carbohydrates: "20",
                                fats: "0"
                            }
                        }
                    ]
                }
            ]
        }
    ]
  },
  {
    id: 1,
    assignedBy: 1,//Id del nutricionista
    assignedTo: 1203, //Id del cliente
    name: 'Dieta equilibrada',
    totalCalories: 2000,
    proteinCalories: 1000,
    carbohydrates: 300,
    fats:700,
    begginingDate: new Date(),
    finishingDate: new Date(),
    days: [
        {
            day:{
                id:1,
                day:"Lunes",
                completed: false,
            },
            id:1,
            meals:[
                {
                    id: 12,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 1,
                            completed: false,
                            quantity:1, //Si es una receta, significa que la porcion de la receta sera esta proporcion ej(1.5 sandwich)
                            food:{
                                id:"3",
                                weight:"150",
                                name:"Jamón",
                                category:"Proteina",
                                calories:"209",
                                protein:"8",
                                carbohydrates:"192",
                                fats:"9"     
                            }
                        }
                    ]
                },
                {
                    id: 13,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 3,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 4,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 14,
                    meal:"Cena",
                    completed: false,
                    foods:[
                        {
                            id: 5,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 6,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:2,
                day:"Martes",
                completed: false,
            },
            id:2,
            meals:[
                {
                    id: 15,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 7,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 16,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 8,
                            quantity: 1,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                    ]
                }
            ]
        },
        {
            day:{
                id:3,
                day:"Miércoles",
                completed: false,
            },
            meals:[
                {
                    id: 17,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 9,
                            quantity: 1,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 10,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:4,
                day:"Jueves",
                completed: false,
            },
            meals:[
                {
                    id: 18,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 11,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 19,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 12,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:5,
                day:"Viernes",
                completed: false,
            },
            meals:[
                {
                    id: 20,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 13,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "7",
                                weight: "150",
                                name: "Huevo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 21,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 14,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "3",
                                weight: "150",
                                name: "Arroz",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },{
            day:{
                id:6,
                day:"Sábado",
                completed: false,
            },
            meals:[
                {
                    id: 22,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 15,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Pan",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 23,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 16,
                            quantity: 1,
                            food: {
                                id: "8",
                                weight: "150",
                                name: "Pescado",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:7,
                day:"Domingo",
                completed: false,
            },
            meals:[
                {
                    id: 24,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 17,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "100",
                                protein: "2",
                                carbohydrates: "25",
                                fats: "1"
                            }
                        }
                    ]
                },
                {
                    id: 25,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 18,
                            quantity: 1,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Sandía",
                                category: "Fruta",
                                calories: "80",
                                protein: "1",
                                carbohydrates: "20",
                                fats: "0"
                            }
                        }
                    ]
                }
            ]
        }
    ]
  },
  {
    id: 1,
    assignedBy: 1,//Id del nutricionista
    assignedTo: 1203, //Id del cliente
    name: 'Dieta equilibrada',
    totalCalories: 2000,
    proteinCalories: 1000,
    carbohydrates: 300,
    fats:700,
    begginingDate: new Date(),
    finishingDate: new Date(),
    days: [
        {
            day:{
                id:1,
                day:"Lunes",
                completed: false,
            },
            id:1,
            meals:[
                {
                    id: 12,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 1,
                            completed: false,
                            quantity:1, //Si es una receta, significa que la porcion de la receta sera esta proporcion ej(1.5 sandwich)
                            food:{
                                id:"3",
                                weight:"150",
                                name:"Jamón",
                                category:"Proteina",
                                calories:"209",
                                protein:"8",
                                carbohydrates:"192",
                                fats:"9"     
                            }
                        }
                    ]
                },
                {
                    id: 13,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 3,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 4,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 14,
                    meal:"Cena",
                    completed: false,
                    foods:[
                        {
                            id: 5,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 6,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:2,
                day:"Martes",
                completed: false,
            },
            id:2,
            meals:[
                {
                    id: 15,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 7,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 16,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 8,
                            quantity: 1,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                    ]
                }
            ]
        },
        {
            day:{
                id:3,
                day:"Miércoles",
                completed: false,
            },
            meals:[
                {
                    id: 17,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 9,
                            quantity: 1,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Sandia",
                                category: "Fruta",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        },
                        {
                            id: 10,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Pollo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:4,
                day:"Jueves",
                completed: false,
            },
            meals:[
                {
                    id: 18,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 11,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "4",
                                weight: "150",
                                name: "Leche",
                                category: "Lácteo",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 19,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 12,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "2",
                                weight: "150",
                                name: "Frijol",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {

            day:{
                id:5,
                day:"Viernes",
                completed: false,
            },
            meals:[
                {
                    id: 20,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 13,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "7",
                                weight: "150",
                                name: "Huevo",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 21,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 14,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "3",
                                weight: "150",
                                name: "Arroz",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },{
            day:{
                id:6,
                day:"Sábado",
                completed: false,
            },
            meals:[
                {
                    id: 22,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 15,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "1",
                                weight: "150",
                                name: "Pan",
                                category: "Grano",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                },
                {
                    id: 23,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 16,
                            quantity: 1,
                            food: {
                                id: "8",
                                weight: "150",
                                name: "Pescado",
                                category: "Proteína",
                                calories: "209",
                                protein: "8",
                                carbohydrates: "192",
                                fats: "9"
                            }
                        }
                    ]
                }
            ]
        },
        {
            day:{
                id:7,
                day:"Domingo",
                completed: false,
            },
            meals:[
                {
                    id: 24,
                    meal:"Desayuno",
                    completed: false,
                    foods:[
                        {
                            id: 17,
                            quantity: 1,
                            completed: false,
                            food: {
                                id: "5",
                                weight: "150",
                                name: "Plátano",
                                category: "Fruta",
                                calories: "100",
                                protein: "2",
                                carbohydrates: "25",
                                fats: "1"
                            }
                        }
                    ]
                },
                {
                    id: 25,
                    meal:"Almuerzo",
                    completed: false,
                    foods:[
                        {
                            id: 18,
                            quantity: 1,
                            food: {
                                id: "6",
                                weight: "150",
                                name: "Sandía",
                                category: "Fruta",
                                calories: "80",
                                protein: "1",
                                carbohydrates: "20",
                                fats: "0"
                            }
                        }
                    ]
                }
            ]
        }
    ]
  },




]