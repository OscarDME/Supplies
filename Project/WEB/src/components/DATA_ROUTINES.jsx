export const RoutinesCard=[
            {
                id: 1,
                name: "Rutina de Fuerza Total",
                author: "Usuario123", /* Id del usuario */
                isPublic: true,
                daysPerWeek: 3,
                difficulty:"Fácil",
                trainingLocation: "Gimnasio",
                dailyRoutines: {
                    Lunes: /*id del dia de la semana*/ {
                        blocks: [
                            {
                                muscleGroup: [1,2], /*ID del musculo o musculos a trabajar en este bloque*/
                                exercises: [
                                    {
                                        exerciseId:     {
                                            id:'2',
                                            name:"Sentadilla",
                                            muscles:["Cuadricep","Pantorilla", "Femoral"],	
                                            difficulty: "Alta",
                                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                                            material: ["Barra"],
                                            type: "Pesas",
                                            injury: "",
                                        },
                                        sets: 3,
                                        reps: 10,
                                        weight: 100,
                                        restBetweenSets: 60,
                                    },                                    
                                    {
                                        exerciseId:{
                                            id:'5',
                                            name:"Trote",
                                            muscles:["Gluteo"],	
                                            difficulty: "Media",
                                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                                            material: [],
                                            type: "Cardiovascular",
                                            injury: ""
                                        },
                                        sets: 1,
                                        time: 10,
                                    },
                                ]
                            },
                            {
                                muscleGroup: [1,2], /*ID del musculo o musculos a trabajar en este bloque*/
                                exercises: [
                                    {
                                        exerciseId:{
                                            id:'1',
                                            name:"Curl",
                                            totalcalories:"269",	
                                            muscles:["Bicep"],	
                                            difficulty: "Baja",
                                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                                            material: ["Mancuerna", "Barra"],
                                            type: "Pesas",
                                            injury: "",
                                        },
                                        sets: 3,
                                        reps: 10,
                                        restBetweenSets: 60,
                                    }
                                ]
                            },
                        ]
                    },                    
                    Miercoles: /*id del dia de la semana*/ {
                        blocks: [
                            {
                                muscleGroup: [1,2], /*ID del musculo o musculos a trabajar en este bloque*/
                                exercises: [
                                    {
                                        exerciseId:    {
                                            id:'3',
                                            name:"Pull up",
                                            muscles:["Bicep","Espalda"],	
                                            difficulty: "Baja",
                                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                                            material: [],
                                            type: "Peso corporal",
                                            injury: "Hombro",
                                        },
                                        sets: 3,
                                        reps: 10,
                                        restBetweenSets: 60,
                                    }
                                ]
                            }
                        ]
                    },

                }
            },
            {
                id: 2,
                name: "Pecho",
                author: "Usuario123", /* Id del usuario */
                isPublic: true,
                daysPerWeek: 3,
                difficulty:"Medio",
                trainingLocation: "Gimnasio",
                dailyRoutines: {
                    Lunes: /*id del dia de la semana*/ {
                        blocks: [
                            {
                                muscleGroup: [1,2], /*ID del musculo o musculos a trabajar en este bloque*/
                                exercises: [
                                    {
                                        exerciseId: 1,
                                        sets: 3,
                                        reps: 10,
                                        restBetweenSets: 60,
                                    }
                                ]
                            }
                        ]
                    },

                }
            },
            {
                id: 3,
                name: "Patas como un poste",
                author: "Usuario123", /* Id del usuario */
                isPublic: true,
                daysPerWeek: 3,
                difficulty:"Difícil",
                trainingLocation: "Gimnasio",
                dailyRoutines: {
                    Lunes: /*id del dia de la semana*/ {
                        blocks: [
                            {
                                muscleGroup: [1,2], /*ID del musculo o musculos a trabajar en este bloque*/
                                exercises: [
                                    {
                                        exerciseId: 1,
                                        sets: 3,
                                        reps: 10,
                                        restBetweenSets: 60,
                                    }
                                ]
                            }
                        ]
                    }
                }
            },{
                id: 4,
                name: "Only Cardio",
                author: "Usuario123", /* Id del usuario */
                isPublic: true,
                daysPerWeek: 1,
                difficulty:"Fácil",
                trainingLocation: "Gimnasio",
                dailyRoutines: {
                    Lunes: /*id del dia de la semana*/ {
                        blocks: [
                            {
                                muscleGroup: [1,2], /*ID del musculo o musculos a trabajar en este bloque*/
                                exercises: [
                                    {
                                        exerciseId: 1,
                                        sets: 3,
                                        reps: 10,
                                        restBetweenSets: 60,
                                    }
                                ]
                            }
                        ]
                    }
                }
            },{
                id: 5,
                name: "La roca workout",
                author: "Usuario123", /* Id del usuario */
                isPublic: true,
                daysPerWeek: 6,
                difficulty:"Difícil",
                trainingLocation: "Gimnasio",
                dailyRoutines: {
                    Lunes: /*id del dia de la semana*/ {
                        blocks: [
                            {
                                muscleGroup: [1,2], /*ID del musculo o musculos a trabajar en este bloque*/
                                exercises: [
                                    {
                                        exerciseId: 1,
                                        sets: 3,
                                        reps: 10,
                                        restBetweenSets: 60,
                                    }
                                ]
                            }
                        ]
                    }
                }
            },{
                id: 6,
                name: "Entrenamiento para futbolistas",
                author: "Usuario123", /* Id del usuario */
                isPublic: true,
                daysPerWeek: 7,
                difficulty:"Medio",
                trainingLocation: "Gimnasio",
                dailyRoutines: {
                    Lunes: /*id del dia de la semana*/ {
                        blocks: [
                            {
                                muscleGroup: [1,2], /*ID del musculo o musculos a trabajar en este bloque*/
                                exercises: [
                                    {
                                        exerciseId: 1,
                                        sets: 3,
                                        reps: 10,
                                        restBetweenSets: 60,
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
]