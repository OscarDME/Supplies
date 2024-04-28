import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const createRutinaPersonalizada = async (req, res) => {
    const ID_Usuario = req.body.ID_Usuario; 
    console.log(ID_Usuario);
    try {
        const pool = await getConnection();
        const datosCuestionarioCompleto = await obtenerDatosCuestionarioCompleto(ID_Usuario);

        const diasEntrenamiento = datosCuestionarioCompleto.puedeEntrenar.length;
        const genero = datosCuestionarioCompleto.usuario.sexo;

        // Si el usuario ha seleccionado manualmente, asigna la rutina en base a sus preferencias
        if (datosCuestionarioCompleto.quiereEntrenar.length > 0) {
            const rutinaDesdeUsuario = crearRutinaPersonalizadaDesdeSeleccionUsuario(datosCuestionarioCompleto.quiereEntrenar, datosCuestionarioCompleto.puedeEntrenar);
            datosCuestionarioCompleto.rutinaAsignada = rutinaDesdeUsuario;
        } else {
            // Si el usuario no ha seleccionado manualmente, asigna la rutina basada en el número de días y género
            const rutina = asignarRutina(diasEntrenamiento, genero, datosCuestionarioCompleto.puedeEntrenar);
            datosCuestionarioCompleto.rutinaAsignada = rutina;
        }
        
        //Calcular tiempo para ejercicios cardiovasculares y de fuerza
        const tiempoDisponible = datosCuestionarioCompleto.cuestionario.TiempoDisponible;
        const [horas, minutos] = tiempoDisponible.split(":").map(Number);
        const tiempoTotalMinutos = horas * 60 + minutos;

        const distribucionTiempo = calcularDistribucionTiempo(datosCuestionarioCompleto.cuestionario.ID_Objetivo, tiempoTotalMinutos);

        console.log("Distribución de tiempo:", distribucionTiempo);

        //Calcular tiempo por cada musculo
        const tiempoFuerzaMinutos = distribucionTiempo.tiempoFuerzaMinutos;
        const tiempoCardioMinutos = distribucionTiempo.tiempoCardioMinutos

        let rutinaConTiempo;
        if (datosCuestionarioCompleto.rutinaAsignada) {
            rutinaConTiempo = calcularTiempoPorMusculo(datosCuestionarioCompleto.rutinaAsignada, tiempoFuerzaMinutos, importancias);
        }
        imprimirRutinaConTiempo(rutinaConTiempo);

        console.log("Rutina con tiempo por músculo asignado:", rutinaConTiempo);
        datosCuestionarioCompleto.rutinaConTiempo = rutinaConTiempo;

        console.log("Datos del cuestionario completo:", datosCuestionarioCompleto);

        let rutinaCreada = [];
        for (const dia of datosCuestionarioCompleto.rutinaConTiempo) {
            const diaConEjercicios = await agregarEjerciciosASeries(dia, datosCuestionarioCompleto, tiempoCardioMinutos, pool);
            rutinaCreada.push(diaConEjercicios);
        }

    imprimirRutinaCreada(rutinaCreada);    
    //Insertar la rutina como tal

    const nombreRutina = `Rutina personalizada de ${datosCuestionarioCompleto.usuario.nombre_usuario}`;

    const insertRutinaResult = await pool.request()
        .input("nombre", sql.NVarChar, nombreRutina)
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .query("INSERT INTO Rutina (nombre, publica, ID_Usuario) OUTPUT INSERTED.ID_Rutina VALUES (@nombre, 0, @ID_Usuario);");
        const ID_Rutina = insertRutinaResult.recordset[0].ID_Rutina;

    // Insertar los días de entrenamiento basados en los días especificados en rutinaConTiempo
    for (const dia of rutinaCreada) {
        // Insertar día de entrenamiento y obtener ID_Dia
        const insertDiaResult = await pool
            .request()
            .input("ID_Rutina", sql.Int, ID_Rutina) // Usar ID_Rutina proporcionado previamente
            .input("ID_Dia", sql.Int, dia.ID_Dia)
            .query(querys.createDiasEntreno);
        const ID_Dia = insertDiaResult.recordset[0].ID_Dias_Entreno;
    
        // Iterar sobre cada ejercicio del día
        for (const ejercicio of dia.musculos) {
            let descansoEnSegundos = ejercicio.ejercicios && ejercicio.ejercicios.length > 0
            ? ejercicio.ejercicios[0].Series[0].Descanso // Tomar el descanso del primer ejercicio
            : 120;            
             
            let horas = Math.floor(descansoEnSegundos / 3600).toString().padStart(2, '0');
            let minutos = Math.floor((descansoEnSegundos % 3600) / 60).toString().padStart(2, '0');
            let segundos = (descansoEnSegundos % 60).toString().padStart(2, '0');
            let descansoComoTime = `${horas}:${minutos}:${segundos}.0000000`;
        
            // Iterar sobre cada ejercicio del músculo
            for (const ejercicioDetalle of ejercicio.ejercicios) {
                // Insertar EjercicioDia
                const insertEjercicioDiaResult = await pool
                    .request()
                    .input("ID_Dias_Entreno", sql.Int, ID_Dia)
                    .input("ID_Ejercicio", sql.Int, ejercicioDetalle.ID_Ejercicio) // Usar el ID_Ejercicio de cada ejercicio
                    .input("descanso", sql.Time, descansoComoTime)
                    .input("superset", sql.Bit, 0) // Asumiendo que no hay superset
                    .query(querys.createEjerciciosDia);
                const ID_EjercicioDia = insertEjercicioDiaResult.recordset[0].ID_EjerciciosDia;
        
                // Insertar BloqueSets
                const resultBloqueSets = await pool
                    .request()
                    .input("ID_EjerciciosDia", sql.Int, ID_EjercicioDia)
                    .query("INSERT INTO BloqueSets (ID_EjerciciosDia) OUTPUT INSERTED.ID_BloqueSets VALUES (@ID_EjerciciosDia);");
                const ID_BloqueSets = resultBloqueSets.recordset[0].ID_BloqueSets;
        
                // Iterar sobre cada serie del ejercicio
                for (const serie of ejercicioDetalle.Series) {
                    // Insertar la serie directamente
                    const resultSerie = await pool.request()
                        .input("repeticiones", sql.Int, serie.Repeticiones)
                        .input("peso", sql.Decimal(10, 2), null) // Asumiendo que no hay peso definido
                        .input("tiempo", sql.Time, null)
                        .query("INSERT INTO Serie (repeticiones, peso, tiempo)  OUTPUT INSERTED.ID_Serie VALUES (@repeticiones, @peso, @tiempo);");
        
                    const ID_Serie = resultSerie.recordset[0].ID_Serie;
        
                    // Insertar ConjuntoSeries
                    await pool.request()
                        .input("ID_BloqueSets", sql.Int, ID_BloqueSets)
                        .input("ID_Serie", sql.Int, ID_Serie)
                        .query("INSERT INTO ConjuntoSeries (ID_BloqueSets, ID_Serie) VALUES (@ID_BloqueSets, @ID_Serie);");
                }
            }
        }
    }
    
    res.json({
        mensaje: "Rutina personalizada creada con éxito.",
        datos: datosCuestionarioCompleto
    });
    } catch (error) {
        console.error("Error al crear la rutina personalizada:", error);
        res.status(500).send("Error al obtener los datos necesarios para la rutina personalizada.");
    }
};
// Esta función devuelve un ID_Ejercicio al azar filtrado por las preferencias del usuario
async function obtenerEjercicioAleatorio(ID_Dificultad, ID_Musculo, ID_Modalidad, ID_LesionExcluir, excluirEjercicios, pool) {
    let queryExclusion = '';
    if (excluirEjercicios.length > 0) {
        const listaExcluidos = excluirEjercicios.join(',');
        queryExclusion = `AND ID_Ejercicio NOT IN (${listaExcluidos})`;
    }
    console.log("Parametros: ", ID_Dificultad, ID_Musculo, ID_Modalidad, ID_LesionExcluir);
    try {
      // Ejecuta la consulta SQL para obtener un ejercicio al azar que coincida con los criterios
      const result = await pool.request()
        .input('ID_Dificultad', sql.Int, ID_Dificultad)
        .input('ID_Musculo', sql.Int, ID_Musculo)
        .input('ID_Modalidad', sql.Int, ID_Modalidad)
        .input('ID_LesionExcluir', sql.Int, ID_LesionExcluir)
        .input('estado', sql.Bit, 1)
        .query(`
            SELECT TOP 1 ID_Ejercicio
            FROM Ejercicio
            WHERE ID_Dificultad <= @ID_Dificultad
            AND ID_Musculo = @ID_Musculo
            AND ID_Modalidad = @ID_Modalidad
            AND (ID_Lesion IS NULL OR ID_Lesion != @ID_LesionExcluir)
            AND estado = @estado
            ${queryExclusion}
            ORDER BY NEWID();
        `);

        console.log("Consulta como resultado:", result.recordset);
  
      if (result.recordset.length > 0) {
        console.log("Ejercicio aleatorio:", result.recordset[0].ID_Ejercicio);
        return result.recordset[0].ID_Ejercicio;
      } else {
        // No se encontraron ejercicios que coincidan con los criterios
        return null;
      }
    } catch (error) {
      console.error("Error al obtener ejercicio aleatorio:", error);
      throw error;
    }
  }

  async function obtenerEjercicioCardiovascularAleatorio(ID_Dificultad, ID_LesionExcluir, pool) {
    try {
      // Ejecuta la consulta SQL para obtener un ejercicio al azar que coincida con los criterios
      const result = await pool.request()
        .input('ID_Dificultad', sql.Int, ID_Dificultad)
        .input('ID_LesionExcluir', sql.Int, ID_LesionExcluir)
        .input('estado', sql.Bit, 1)
        .query(`
          SELECT TOP 1 ID_Ejercicio
          FROM Ejercicio
          WHERE ID_Dificultad <= @ID_Dificultad
          AND ID_Modalidad = 3
          AND (ID_Lesion IS NULL OR ID_Lesion != @ID_LesionExcluir)
          AND estado = @estado
          ORDER BY NEWID(); -- NEWID() 
        `);

        console.log("Consulta como resultado:", result.recordset);
  
      if (result.recordset.length > 0) {
        console.log("Ejercicio aleatorio:", result.recordset[0].ID_Ejercicio);
        return result.recordset[0].ID_Ejercicio;
      } else {
        // No se encontraron ejercicios que coincidan con los criterios
        return null;
      }
    } catch (error) {
      console.error("Error al obtener ejercicio aleatorio:", error);
      throw error;
    }
  }


  async function agregarEjerciciosASeries(dia, datosCuestionarioCompleto, tiempoCardioMinutos, pool) {
    const ejerciciosSeleccionados = []; // Array para almacenar los ID_Ejercicio ya seleccionados.
    for (const musculo of dia.musculos) {
        let tiempoRestanteMusculo = musculo.tiempo * 60; 
        console.log("Tiempo total músculo:", tiempoRestanteMusculo);
        musculo.ejercicios = musculo.ejercicios || [];

        while (tiempoRestanteMusculo > 0) {
            console.log("Tiempo restante músculo:", tiempoRestanteMusculo);
            let ID_Modalidad;
            switch (datosCuestionarioCompleto.cuestionario.ID_EspacioDisponible) {
                case 1: // Gimnasio
                    ID_Modalidad = 2; // fuerza
                    break;
                case 2: // Casa
                    // Si dispone de pesas, usamos pesas, si no, peso corporal
                    ID_Modalidad = datosCuestionarioCompleto.dispone.some(item => item.ID_Material === 2) ? 2 : 1;
                    break;
                case 3: // Calistenia
                    ID_Modalidad = 1; // Peso corporal
                    break;
                default:
                    throw new Error('Espacio disponible no válido');
            }
            const lesion = datosCuestionarioCompleto.padece[0].ID_Lesion;
            
            // Intentar obtener un ejercicio que no esté relacionado con las lesiones del usuario.
            // Suponemos que obtenerEjercicioAleatorio ya está adaptado para manejar múltiples lesiones.
            const ID_Ejercicio = await obtenerEjercicioAleatorio(
                datosCuestionarioCompleto.cuestionario.ID_NivelFormaFisica,
                musculo.idMusculo,
                ID_Modalidad,
                lesion,
                ejerciciosSeleccionados,
                pool
            );

            if (ID_Ejercicio) {
                ejerciciosSeleccionados.push(ID_Ejercicio);
                console.log("Ejercicio encontrado:", ID_Ejercicio);
                // Información del ejercicio basada en el objetivo
                const infoEjercicio = obtenerInfoEjercicioPorObjetivo(datosCuestionarioCompleto.cuestionario.ID_Objetivo);

                var seriesAgregadas = 0;
                let tiempoPorEjercicio = 0;

                while (seriesAgregadas < 3 && tiempoRestanteMusculo - tiempoPorEjercicio >= infoEjercicio.tiempoPorSerie) {
                    tiempoPorEjercicio += infoEjercicio.tiempoPorSerie;
                    seriesAgregadas++;
                }

                if (seriesAgregadas > 0) {
                    console.log("Agregando ejercicio a músculo:", musculo.idMusculo, "con ID_Ejercicio:", ID_Ejercicio);
                    musculo.ejercicios = musculo.ejercicios || [];
                    musculo.ejercicios.push({
                        ID_Ejercicio: ID_Ejercicio,
                        Series: Array(seriesAgregadas).fill({
                            Repeticiones: infoEjercicio.repeticiones,
                            Descanso: infoEjercicio.descanso,
                            DuracionPorRepeticion: infoEjercicio.duracionPorRepeticion,
                            TiempoPorSerie: infoEjercicio.tiempoPorSerie
                        })
                    });
                    
                    // Restar el tiempo utilizado por los ejercicios agregados del tiempo restante del músculo.
                    tiempoRestanteMusculo -= tiempoPorEjercicio;
                }
            }

            // Si no se pudo agregar ningún ejercicio o se alcanzó el límite de tiempo, salir del bucle.
            if (!ID_Ejercicio || seriesAgregadas === 0) break;
        }
    }
    const tiempoRestanteTotalDia = tiempoCardioMinutos * 60; // Convertir minutos a segundos.
    const ID_Dificultad = datosCuestionarioCompleto.cuestionario.ID_NivelFormaFisica;
    const ID_LesionExcluir = datosCuestionarioCompleto.padece[0].ID_Lesion; // Asumiendo que podrías tener más de una lesión para excluir.

    const ID_EjercicioCardiovascular = await obtenerEjercicioCardiovascularAleatorio(ID_Dificultad, ID_LesionExcluir, pool);
    
    if (ID_EjercicioCardiovascular) {
        dia.ejerciciosCardio = dia.ejerciciosCardio || []; // Asegúrate de que el array de ejercicios cardio existe.
        
        dia.ejerciciosCardio.push({
            ID_Ejercicio: ID_EjercicioCardiovascular,
            Tipo: "Cardiovascular",
            Series: [{
                Duracion: convertirSegundosAHMS(tiempoRestanteTotalDia) // Convierte los segundos a formato HH:MM:SS
            }]
        });
    }
    return dia;
}

// Esto es una función de ejemplo que tendrás que definir tú mismo
function obtenerInfoEjercicioPorObjetivo(idObjetivo) {
    switch (idObjetivo) {
        case 1: // Perder peso
            return { repeticiones: 15, descanso: 120, duracionPorRepeticion: 2, tiempoPorSerie: 150 };
        case 2: // Ganar musculo
            return { repeticiones: 10, descanso: 180, duracionPorRepeticion: 3, tiempoPorSerie: 210 };
        case 3: // Mantenimiento
            return { repeticiones: 12, descanso: 180, duracionPorRepeticion: 2, tiempoPorSerie: 204 };
        default:
            // Definir un caso por defecto o lanzar un error
            throw new Error('Objetivo no válido');
    }
}

//Funcion para obtener los datos del cuestionario necesarios
export const obtenerDatosCuestionarioCompleto = async (ID_Usuario) => {
    try {
        const pool = await getConnection();
        const usuarioMovilResult = await pool.request()
            .input('ID_Usuario', sql.VarChar, ID_Usuario)
            .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");

        if (usuarioMovilResult.recordset.length === 0) {
            return res.status(404).send("No se encontró el usuario móvil relacionado.");
        }

        const ID_UsuarioMovil = usuarioMovilResult.recordset[0].ID_UsuarioMovil;
        const cuestionarioResult = await pool.request()
            .input('ID_UsuarioMovil', sql.Int, ID_UsuarioMovil)
            .query(querys.getCuestionario);

        if (cuestionarioResult.recordset.length === 0) {
            return res.status(404).send("No se encontraron datos del cuestionario para el usuario.");
        }

        const ID_Cuestionario = cuestionarioResult.recordset[0].ID_Cuestionario;
        const datosRelacionados = await Promise.all([
            pool.request().input('ID_Cuestionario', sql.Int, ID_Cuestionario).query(querys.getPadece),
            pool.request().input('ID_Cuestionario', sql.Int, ID_Cuestionario).query(querys.getQuiereEntrenar),
            pool.request().input('ID_Cuestionario', sql.Int, ID_Cuestionario).query(querys.getDispone),
            pool.request().input('ID_Cuestionario', sql.Int, ID_Cuestionario).query(querys.getPuedeEntrenar),
            pool.request().input('ID_Usuario', sql.VarChar, ID_Usuario).query(querys.getUsuario),
        ]);

        const respuesta = {
            cuestionario: cuestionarioResult.recordset[0],
            usuario: datosRelacionados[4].recordset[0],
            padece: datosRelacionados[0].recordset,
            quiereEntrenar: datosRelacionados[1].recordset,
            dispone: datosRelacionados[2].recordset,
            puedeEntrenar: datosRelacionados[3].recordset
        };

        return respuesta;
    } catch (error) {
        console.error("Error al obtener datos del cuestionario completo:", error);
        throw error; 
    }
};



// Asignar split de entrenamiento automaticamente por el sistema
function asignarRutina(diasEntrenamiento, genero, diasPuedeEntrenar) {
    let rutina = [];

    // Definir ID de músculos para cada rutina
    const cuerpoCompleto = [6, 7, 1, 2, 3]; // Cuádriceps, Femoral, Pecho, Espalda, Hombro
    const trenSuperior = [1, 2, 3, 4, 5]; // Pecho, Espalda, Hombro, Bicep, Tricep
    const trenInferior = [6, 7, 8, 9]; // Cuádriceps, Femoral, Gluteo, Pantorrilla

    const asignacion = {
        1: cuerpoCompleto,
        2: [cuerpoCompleto, cuerpoCompleto],
        3: [cuerpoCompleto, cuerpoCompleto, cuerpoCompleto],
        4: [trenSuperior, trenInferior, trenSuperior, trenInferior],
        5: genero === 'H' ? [[1, 3, 5], [2, 4], trenInferior, trenSuperior, trenInferior] : [[6, 7, 8], [1, 2], [6, 7, 8], [4, 5], [6, 7, 8]],
        6: genero === 'H' ? [[2, 1], [4, 5, 3], trenInferior, [2, 1], [4, 5, 3], trenInferior] : [[6, 7, 8], [1, 5], [2, 3], [6, 7, 8], [2, 4], [6, 7, 8]]
    };

    // Seleccionar la rutina basada en los días de entrenamiento y género
    rutina = asignacion[diasEntrenamiento] || [];

    // Mapear cada día de entrenamiento con su respectivo ID_Dia
    return rutina.map((musculos, index) => {
        // Asegurarse de que hay un ID_Dia correspondiente disponible
        const idDia = diasPuedeEntrenar[index]?.ID_Dia;
        if (idDia !== undefined) {
            return { ID_Dia: idDia, idMusculos: musculos };
        }
        return null;
    }).filter(e => e !== null); // Filtrar cualquier entrada no válida (por si acaso)
}

//Asignar split de entrenamiento en base a las preferencias del usuario
function crearRutinaPersonalizadaDesdeSeleccionUsuario(quiereEntrenar, puedeEntrenar) {
    // Crea un objeto que agrupa los músculos por ID_Dia
    let rutinaPorDia = quiereEntrenar.reduce((acc, item) => {
        // Encuentra el objeto de puedeEntrenar correspondiente para obtener el ID_Dia real
        const diaEntrenamiento = puedeEntrenar.find(dia => dia.ID_Dia === item.ID_Dia);
        if (diaEntrenamiento) {
            // Si el día ya existe en el acumulador, añade el músculo a ese día
            if (!acc[diaEntrenamiento.ID_PuedeEntrenar]) {
                acc[diaEntrenamiento.ID_PuedeEntrenar] = {
                    ID_Dia: item.ID_Dia,
                    idMusculos: []
                };
            }
            acc[diaEntrenamiento.ID_PuedeEntrenar].idMusculos.push(item.ID_Musculo);
        }
        return acc;
    }, {});

    // Convertir el objeto a un array de objetos para la rutina asignada
    return Object.values(rutinaPorDia);
}

//Calcular la distribucion de tiempo de ejercicios cardiovasculares y de fuerza
function calcularDistribucionTiempo(idObjetivo, tiempoTotalMinutos) {
    let porcentajeCardio, porcentajeFuerza;

    switch (idObjetivo) {
        case 1: // Perder peso
            porcentajeCardio = 0.50;
            porcentajeFuerza = 0.50;
            break;
        case 2: // Ganar masa muscular
            porcentajeCardio = 0.20;
            porcentajeFuerza = 0.80;
            break;
        case 3: // Mantenimiento
            porcentajeCardio = 0.30;
            porcentajeFuerza = 0.70;
            break;
        default:
            porcentajeCardio = 0.30;
            porcentajeFuerza = 0.70;
    }

    const tiempoCardioMinutos = Math.round(tiempoTotalMinutos * porcentajeCardio);
    const tiempoFuerzaMinutos = tiempoTotalMinutos - tiempoCardioMinutos; // Asegura que la suma sea 100%

    return {
        tiempoCardioMinutos,
        tiempoFuerzaMinutos
    };
}

const importancias = {
    1: 1, // Pecho
    2: 2, // Espalda
    3: 3, // Hombro
    4: 4, // Bíceps
    5: 5, // Tríceps
    6: 1, // Cuádriceps
    7: 2, // Femoral
    8: 3, // Glúteo
    9: 4, // Pantorrillas
};

//Funcion para calcular el tiempo asignado a cada musculo
function calcularTiempoPorMusculo(rutinaAsignada, tiempoFuerzaMinutos, importancias) {
    return rutinaAsignada.map(dia => {
        // Calcular la suma de las importancias inversas para los músculos de este día
        const sumaImportanciasInversas = dia.idMusculos.reduce((suma, idMusculo) => suma + (1 / importancias[idMusculo]), 0);

        // Asignar tiempo a cada músculo basado en su importancia inversa
        const musculosConTiempo = dia.idMusculos.map(idMusculo => {
            const importanciaInversaMusculo = 1 / importancias[idMusculo];
            const porcentajeDelTotal = importanciaInversaMusculo / sumaImportanciasInversas;
            const tiempoMusculo = tiempoFuerzaMinutos * porcentajeDelTotal;
            return { idMusculo, tiempo: Math.round(tiempoMusculo) };
        });
        return { ID_Dia: dia.ID_Dia, musculos: musculosConTiempo };
    });
}

//Funcion de prueba para imprimir como JSON
function imprimirRutinaConTiempo(rutinaConTiempo) {
    rutinaConTiempo.forEach(dia => {
        console.log(`Día ${dia.ID_Dia}:`);
        dia.musculos.forEach(musculo => {
            console.log(JSON.stringify(musculo, null, 3)); // Formatea la salida
        });
    });
}

function imprimirRutinaCreada(rutinaCreada) {
    // Convertir el arreglo rutinaCreada en una cadena JSON con una profundidad suficiente
    const rutinaCreadaString = JSON.stringify(rutinaCreada, null, 3);
    console.log("Rutina Creada:", rutinaCreadaString);
}

function convertirSegundosAHMS(segundos) {
    let horas = Math.floor(segundos / 3600);
    let minutos = Math.floor((segundos - (horas * 3600)) / 60);
    let segundosRestantes = segundos - (horas * 3600) - (minutos * 60);

    // Añade ceros al inicio si es necesario
    horas = (horas < 10) ? "0" + horas : horas;
    minutos = (minutos < 10) ? "0" + minutos : minutos;
    segundosRestantes = (segundosRestantes < 10) ? "0" + segundosRestantes : segundosRestantes;

    return horas + ":" + minutos + ":" + segundosRestantes;
}

  