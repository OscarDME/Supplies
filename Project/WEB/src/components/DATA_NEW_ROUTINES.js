export const RoutineCard = [
    {
        id:1,
        name:"Rutina de prueba 1",
        author: "Usuario123", /* Id del usuario Foreign key */
        isPublic: true,
        difficulty:"Fácil",
        assignedBy: null,
        assignedTo: null,
        isTemplate: true,
        trainingLocation: "Gimnasio",
        days:[
            {
                id:999,
                dayName:"Lunes",
                assignedDate: null,
                assignedHour: null ,
                exercises:[
                    {
                        id:123,
                        exerciseToWork:{
                            id:2,
                            name:"Sentadilla",
                            muscles:["Cuadricep","Pantorilla", "Femoral"],	
                            difficulty: "Alta",
                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            material: ["Barra"],
                            type: "Pesas",
                            injury: "",
                        },
                        rest: 90,
                        isSuperSet: true, 
                        /*Si el estado es false, se ejecutan todos los sets de este ejercicio de corrido,
                        si el estado es true se ejecuta el primer set de este ejercicio y el primer set del siguiente ejercicio,
                         y despues el segundo set de este ejercicio y el segundo set del otro ejercicio hasta terminar
                        con los sets de ambos ejercicios, se van alternando*/

                        sets:[
                            //primer set es un dropset
                            [
                             {
                                id:123,
                                reps: 10, 
                                weight: 0,
                                time: 0,
                             },
                             {
                                id:124,
                                reps: 15,
                                weight: 0,
                                time: 0,
                             }
                        ],
                        //segundo set es un set normal
                        [
                            {
                               id:129,
                               reps: 10, 
                               weight: 0,
                               time: 0,
                            },
                       ]
                        ]
                    },
                    {
                        id:123,
                        exerciseToWork:{
                            id:3,
                            name:"Curl",
                            muscles:["Cuadricep","Pantorilla", "Femoral"],	
                            difficulty: "Alta",
                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            material: ["Barra"],
                            type: "Cardiovascular",
                            injury: "",
                        },
                        rest: 90,
                        isSuperSet: false, /*Si el estado es false, se ejecutan todos los sets de este ejercicio de corrido,
                        si el estado es true se ejecuta el primer set de este ejercicio y el primer set del siguiente ejercicio,
                         y despues el segundo set de este ejercicio y el segundo set del otro ejercicio hasta terminar
                        con los sets de ambos ejercicios, se van alternando*/
                        sets:[
                            //primer set es set normal, los ejercicios cardiovasculares solamente tienen un set
                            [
                             {
                                id: 126,
                                reps:0,
                                weight: 0,
                                time: 40,
                             }
                        ]

                        ]
                    }

                ]
            },            {
                id:93459,
                dayName:"Miércoles",
                exercises:[
                    {
                        id:12653,
                        exerciseToWork:{
                            id:2,
                            name:"Sentadilla",
                            muscles:["Cuadricep","Pantorilla", "Femoral"],	
                            difficulty: "Alta",
                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            material: ["Barra"],
                            type: "Pesas",
                            injury: "",
                        },
                        rest: 90,
                        isSuperSet: false, 
                        /*Si el estado es false, se ejecutan todos los sets de este ejercicio de corrido,
                        si el estado es true se ejecuta el primer set de este ejercicio y el primer set del siguiente ejercicio,
                         y despues el segundo set de este ejercicio y el segundo set del otro ejercicio hasta terminar
                        con los sets de ambos ejercicios, se van alternando*/

                        sets:[
                            //primer set es un dropset
                            [
                             {
                                id:123,
                                reps: 10, 
                                weight: 0,
                                time: 0,
                             },
                             {
                                id:124,
                                reps: 15,
                                weight: 0,
                                time: 0,
                             }
                        ],
                        //segundo set es un set normal
                        [
                            {
                               id:129,
                               reps: 10, 
                               weight: 0,
                               time: 0,
                            },
                       ]
                        ]
                    },
                    {
                        id:156756723,
                        exerciseToWork:{
                            id:3,
                            name:"Curl",
                            muscles:["Cuadricep","Pantorilla", "Femoral"],	
                            difficulty: "Alta",
                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            material: ["Barra"],
                            type: "Cardiovascular",
                            injury: "",
                        },
                        rest: 90,
                        isSuperSet: false, /*Si el estado es false, se ejecutan todos los sets de este ejercicio de corrido,
                        si el estado es true se ejecuta el primer set de este ejercicio y el primer set del siguiente ejercicio,
                         y despues el segundo set de este ejercicio y el segundo set del otro ejercicio hasta terminar
                        con los sets de ambos ejercicios, se van alternando*/
                        sets:[
                            //primer set es set normal, los ejercicios cardiovasculares solamente tienen un set
                            [
                             {
                                id: 126,
                                reps:0,
                                weight: 0,
                                time: 40,
                             }
                        ],                            [
                             {
                                id: 127,
                                reps:0,
                                weight: 0,
                                time: 40,
                             }
                        ]

                        ]
                    }

                ]
            },

        ]
    },
    {
        id:1134,
        name:"Rutina de prueba 1",
        author: "Usuario123", /* Id del usuario Foreign key */
        isPublic: true,
        difficulty:"Difícil",
        trainingLocation: "Gimnasio",
        days:[
            {
                id:999,
                dayName:"Lunes",
                exercises:[
                    {
                        id:123,
                        exerciseToWork:{
                            id:2,
                            name:"Sentadilla",
                            muscles:["Cuadricep","Pantorilla", "Femoral"],	
                            difficulty: "Alta",
                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            material: ["Barra"],
                            type: "Pesas",
                            injury: "",
                        },
                        rest: 90,
                        isSuperSet: true, 
                        /*Si el estado es false, se ejecutan todos los sets de este ejercicio de corrido,
                        si el estado es true se ejecuta el primer set de este ejercicio y el primer set del siguiente ejercicio,
                         y despues el segundo set de este ejercicio y el segundo set del otro ejercicio hasta terminar
                        con los sets de ambos ejercicios, se van alternando*/

                        sets:[
                            //primer set es un dropset
                            [
                             {
                                id:123,
                                reps: 10, 
                                weight: 0,
                                time: 0,
                             },
                             {
                                id:124,
                                reps: 15,
                                weight: 0,
                                time: 0,
                             }
                        ],
                        //segundo set es un set normal
                        [
                            {
                               id:129,
                               reps: 10, 
                               weight: 0,
                               time: 0,
                            },
                       ]
                        ]
                    },
                    {
                        id:123,
                        exerciseToWork:{
                            id:3,
                            name:"Curl",
                            muscles:["Cuadricep","Pantorilla", "Femoral"],	
                            difficulty: "Alta",
                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            material: ["Barra"],
                            type: "Cardiovascular",
                            injury: "",
                        },
                        rest: 90,
                        isSuperSet: false, /*Si el estado es false, se ejecutan todos los sets de este ejercicio de corrido,
                        si el estado es true se ejecuta el primer set de este ejercicio y el primer set del siguiente ejercicio,
                         y despues el segundo set de este ejercicio y el segundo set del otro ejercicio hasta terminar
                        con los sets de ambos ejercicios, se van alternando*/
                        sets:[
                            //primer set es set normal, los ejercicios cardiovasculares solamente tienen un set
                            [
                             {
                                id: 126,
                                reps:0,
                                weight: 0,
                                time: 40,
                             }
                        ],                            [
                             {
                                id: 127,
                                reps:0,
                                weight: 0,
                                time: 40,
                             }
                        ]

                        ]
                    }

                ]
            },            {
                id:93459,
                dayName:"Miércoles",
                exercises:[
                    {
                        id:12653,
                        exerciseToWork:{
                            id:2,
                            name:"Sentadilla",
                            muscles:["Cuadricep","Pantorilla", "Femoral"],	
                            difficulty: "Alta",
                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            material: ["Barra"],
                            type: "Pesas",
                            injury: "",
                        },
                        rest: 90,
                        isSuperSet: true, 
                        /*Si el estado es false, se ejecutan todos los sets de este ejercicio de corrido,
                        si el estado es true se ejecuta el primer set de este ejercicio y el primer set del siguiente ejercicio,
                         y despues el segundo set de este ejercicio y el segundo set del otro ejercicio hasta terminar
                        con los sets de ambos ejercicios, se van alternando*/

                        sets:[
                            //primer set es un dropset
                            [
                             {
                                id:123,
                                reps: 10, 
                                weight: 0,
                                time: 0,
                             },
                             {
                                id:124,
                                reps: 15,
                                weight: 0,
                                time: 0,
                             }
                        ],
                        //segundo set es un set normal
                        [
                            {
                               id:129,
                               reps: 10, 
                               weight: 0,
                               time: 0,
                            },
                       ]
                        ]
                    },
                    {
                        id:156756723,
                        exerciseToWork:{
                            id:3,
                            name:"Curl",
                            muscles:["Cuadricep","Pantorilla", "Femoral"],	
                            difficulty: "Alta",
                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            material: ["Barra"],
                            type: "Cardiovascular",
                            injury: "",
                        },
                        rest: 90,
                        isSuperSet: false, /*Si el estado es false, se ejecutan todos los sets de este ejercicio de corrido,
                        si el estado es true se ejecuta el primer set de este ejercicio y el primer set del siguiente ejercicio,
                         y despues el segundo set de este ejercicio y el segundo set del otro ejercicio hasta terminar
                        con los sets de ambos ejercicios, se van alternando*/
                        sets:[
                            //primer set es set normal, los ejercicios cardiovasculares solamente tienen un set
                            [
                             {
                                id: 126,
                                reps:0,
                                weight: 0,
                                time: 40,
                             }
                        ],                            [
                             {
                                id: 127,
                                reps:0,
                                weight: 0,
                                time: 40,
                             }
                        ]

                        ]
                    }

                ]
            },

        ]
    },    {
        id:1133454,
        name:"Rutina de prueba 1",
        author: "Usuario123", /* Id del usuario Foreign key */
        isPublic: true,
        difficulty:"Medio",
        trainingLocation: "Gimnasio",
        days:[
            {
                id:999,
                dayName:"Lunes",
                exercises:[
                    {
                        id:123,
                        exerciseToWork:{
                            id:2,
                            name:"Sentadilla",
                            muscles:["Cuadricep","Pantorilla", "Femoral"],	
                            difficulty: "Alta",
                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            material: ["Barra"],
                            type: "Pesas",
                            injury: "",
                        },
                        rest: 90,
                        isSuperSet: true, 
                        /*Si el estado es false, se ejecutan todos los sets de este ejercicio de corrido,
                        si el estado es true se ejecuta el primer set de este ejercicio y el primer set del siguiente ejercicio,
                         y despues el segundo set de este ejercicio y el segundo set del otro ejercicio hasta terminar
                        con los sets de ambos ejercicios, se van alternando*/

                        sets:[
                            //primer set es un dropset
                            [
                             {
                                id:123,
                                reps: 10, 
                                weight: 0,
                                time: 0,
                             },
                             {
                                id:124,
                                reps: 15,
                                weight: 0,
                                time: 0,
                             }
                        ],
                        //segundo set es un set normal
                        [
                            {
                               id:129,
                               reps: 10, 
                               weight: 0,
                               time: 0,
                            },
                       ]
                        ]
                    },
                    {
                        id:123,
                        exerciseToWork:{
                            id:3,
                            name:"Curl",
                            muscles:["Cuadricep","Pantorilla", "Femoral"],	
                            difficulty: "Alta",
                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            material: ["Barra"],
                            type: "Cardiovascular",
                            injury: "",
                        },
                        rest: 90,
                        isSuperSet: false, /*Si el estado es false, se ejecutan todos los sets de este ejercicio de corrido,
                        si el estado es true se ejecuta el primer set de este ejercicio y el primer set del siguiente ejercicio,
                         y despues el segundo set de este ejercicio y el segundo set del otro ejercicio hasta terminar
                        con los sets de ambos ejercicios, se van alternando*/
                        sets:[
                            //primer set es set normal, los ejercicios cardiovasculares solamente tienen un set
                            [
                             {
                                id: 126,
                                reps:0,
                                weight: 0,
                                time: 40,
                             }
                        ],                            [
                             {
                                id: 127,
                                reps:0,
                                weight: 0,
                                time: 40,
                             }
                        ]

                        ]
                    }

                ]
            },            {
                id:93459,
                dayName:"Miércoles",
                exercises:[
                    {
                        id:12653,
                        exerciseToWork:{
                            id:2,
                            name:"Sentadilla",
                            muscles:["Cuadricep","Pantorilla", "Femoral"],	
                            difficulty: "Alta",
                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            material: ["Barra"],
                            type: "Pesas",
                            injury: "",
                        },
                        rest: 90,
                        isSuperSet: true, 
                        /*Si el estado es false, se ejecutan todos los sets de este ejercicio de corrido,
                        si el estado es true se ejecuta el primer set de este ejercicio y el primer set del siguiente ejercicio,
                         y despues el segundo set de este ejercicio y el segundo set del otro ejercicio hasta terminar
                        con los sets de ambos ejercicios, se van alternando*/

                        sets:[
                            //primer set es un dropset
                            [
                             {
                                id:123,
                                reps: 10, 
                                weight: 0,
                                time: 0,
                             },
                             {
                                id:124,
                                reps: 15,
                                weight: 0,
                                time: 0,
                             }
                        ],
                        //segundo set es un set normal
                        [
                            {
                               id:129,
                               reps: 10, 
                               weight: 0,
                               time: 0,
                            },
                       ]
                        ]
                    },
                    {
                        id:156756723,
                        exerciseToWork:{
                            id:3,
                            name:"Curl",
                            muscles:["Cuadricep","Pantorilla", "Femoral"],	
                            difficulty: "Alta",
                            indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            preparation: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                            material: ["Barra"],
                            type: "Cardiovascular",
                            injury: "",
                        },
                        rest: 90,
                        isSuperSet: false, /*Si el estado es false, se ejecutan todos los sets de este ejercicio de corrido,
                        si el estado es true se ejecuta el primer set de este ejercicio y el primer set del siguiente ejercicio,
                         y despues el segundo set de este ejercicio y el segundo set del otro ejercicio hasta terminar
                        con los sets de ambos ejercicios, se van alternando*/
                        sets:[
                            //primer set es set normal, los ejercicios cardiovasculares solamente tienen un set
                            [
                             {
                                id: 126,
                                reps:0,
                                weight: 0,
                                time: 40,
                             }
                        ],                            [
                             {
                                id: 127,
                                reps:0,
                                weight: 0,
                                time: 40,
                             }
                        ]

                        ]
                    }

                ]
            },

        ]
    },
]