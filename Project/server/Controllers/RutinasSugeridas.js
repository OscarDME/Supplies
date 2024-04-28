import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";


export const getRutinasSugeridas = async (req, res) => {
    try {
        const userID = req.params.id; // Asegúrate de pasar el ID del usuario como parámetro en la ruta
       
        const pool = await getConnection();
        const mobileUserResult = await pool
        .request()
        .input("ID_Usuario", sql.VarChar, userID)
        .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
        const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;

        const result = await pool.request()
            .input('userID', sql.Int, ID_UsuarioMovil)
            .query(`
                SELECT 
                    AVG(cnt.DiasPorRutina) as PromedioDias,
                    AVG(cnt.DuracionPromedio) as PromedioDuracion,
                    ROUND(AVG(CAST(cnt.ID_Objetivo AS FLOAT)), 0) as PromedioIDObjetivo,
                    ROUND(AVG(CAST(cnt.ID_NivelFormaFisica AS FLOAT)), 0) as PromedioIDNivelFormaFisica
                FROM (
                    SELECT 
                        COUNT(*) as DiasPorRutina,
                        AVG(R.duracion) as DuracionPromedio,
                        R.ID_Objetivo,
                        R.ID_NivelFormaFisica
                    FROM [dbo].[Dias_Entreno] DE
                    JOIN [dbo].[Rutina_Asignada] RA ON DE.ID_Rutina = RA.ID_Rutina
                    JOIN [dbo].[Rutina] R ON RA.ID_Rutina = R.ID_Rutina
                    WHERE RA.ID_UsuarioMovil = @userID
                    AND RA.fecha_asignacion >= DATEADD(MONTH, -6, GETDATE())
                    GROUP BY RA.ID_Rutina, R.ID_Objetivo, R.ID_NivelFormaFisica
                ) cnt;
            `);

            const averageDays = result.recordset[0].PromedioDias;
            const averageDurationMinutes = result.recordset[0].PromedioDuracion / 60; // Convertir segundos a minutos
            console.log(averageDays);
            console.log(averageDurationMinutes);
            console.log(result.recordset[0].PromedioIDObjetivo);
            console.log(result.recordset[0].PromedioIDNivelFormaFisica);

            const publicRoutinesResult = await pool.request()
                .input('userID', sql.VarChar, userID) 
                .query(`
                    SELECT R.ID_Rutina, R.nombre AS NombreRutina, U.nombre_usuario AS Autor, R.duracion AS DuracionRutina, COUNT(DE.ID_Dias_Entreno) AS DiasRutina, R.ID_Objetivo AS ObjetivoRutina, R.ID_NivelFormaFisica
                    FROM [dbo].[Rutina] R
                    INNER JOIN [dbo].[Dias_Entreno] DE ON R.ID_Rutina = DE.ID_Rutina
                    INNER JOIN [dbo].[Usuario] U ON R.ID_Usuario = U.ID_Usuario
                    WHERE R.publica = 1 AND R.ID_Usuario <> @userID
                    GROUP BY R.ID_Rutina, R.nombre, U.nombre_usuario, R.duracion, R.ID_Objetivo, R.ID_NivelFormaFisica;
                `);
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
            ]);
        
            const lesionesUsuario = datosRelacionados[0].recordset.map(lesion => lesion.ID_Lesion);
            const ID_EspacioDisponible = await obtenerEspacioDisponibleUsuario(pool, ID_UsuarioMovil);
            const ID_EquiposUsuario = await obtenerEquipamientoUsuario(pool, ID_Cuestionario);

            const rutinasSugeridas = await Promise.all(
                publicRoutinesResult.recordset.map(async (rutina) => {
                  // Variables para calcular los coeficientes
                  const diasRutina = rutina.DiasRutina;
                  const duracionRutinaMinutes = rutina.DuracionRutina / 60; // Convertir segundos a minutos
                  const coeficienteDias = (Math.min(averageDays, diasRutina) / 7) * 0.2;
                  const diffTiempo = Math.abs(averageDurationMinutes - duracionRutinaMinutes);
                  const coefTiempo = 0.15 * (1 - Math.min(diffTiempo, 60) / 60);
                  const objetivoRutina = rutina.ObjetivoRutina;
                  const coeficienteObjetivo = calcularCoincidenciaObjetivos(result.recordset[0].PromedioIDObjetivo, objetivoRutina);
                  const nivelUsuario = mapearCondicionFisica(result.recordset[0].PromedioIDNivelFormaFisica);
                  const nivelRutina = mapearCondicionFisica(rutina.ID_NivelFormaFisica);
                  const diffNivel = Math.abs(nivelUsuario - nivelRutina);
                  const coeficienteCondicionFisica = 0.15 * (1 - diffNivel);
                  
                  // Obtener los ejercicios de la rutina
                  const ejerciciosRutina = await obtenerEjerciciosRutina(pool, rutina.ID_Rutina);
                  
                  // Calcular el coeficiente de lesiones
                  const coefLesiones = calcularCoeficienteLesiones(lesionesUsuario, ejerciciosRutina);
                  const coeficienteEquipo = calcularCoeficienteEquipo(ID_EspacioDisponible, ID_EquiposUsuario, ejerciciosRutina);

                  const musculoPreferente = await obtenerMusculoPreferente(pool, ID_UsuarioMovil);

                const coeficienteMusculoPreferente = await calcularCoeficienteMusculoPreferente(musculoPreferente, ejerciciosRutina);

                  // Calcula el coeficiente total\
                  const coeficienteTotal = coeficienteDias + coefTiempo + coeficienteObjetivo + coeficienteCondicionFisica + coefLesiones + coeficienteEquipo + coeficienteMusculoPreferente;

              
                  // Logs para depuración
                  console.log("Rutina:", rutina.NombreRutina);
                  console.log("Coeficiente dias:", coeficienteDias);
                  console.log("Coeficiente tiempo:", coefTiempo);
                  console.log("Coeficiente objetivo:", coeficienteObjetivo);
                  console.log("Coeficiente condicion fisica:", coeficienteCondicionFisica);
                  console.log("Coeficiente lesiones:", coefLesiones);
                  console.log("Coeficiente equipo:", coeficienteEquipo);
                  console.log("Coeficiente musculo preferente:", coeficienteMusculoPreferente);
                  
                  // Devuelve la rutina con su coeficiente total
                  return {
                    ...rutina,
                    coeficiente: coeficienteTotal
                  };
                })
              );
              
              // Ahora que todas las promesas están resueltas, puedes ordenar el array resultante
              const rutinasSugeridasOrdenadas = rutinasSugeridas.sort((a, b) => b.coeficiente - a.coeficiente);
              

        console.log(rutinasSugeridasOrdenadas);

        if (rutinasSugeridas.length > 0) {
            res.json(rutinasSugeridasOrdenadas);
        } else {
             res.status(404).send('No routines found for this user in the past 6 months.');
        }
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).send('Error retrieving data');
    }
};

function calcularCoincidenciaObjetivos(objetivoUsuario, objetivoRutina) {
    if (objetivoUsuario === objetivoRutina) {
        return 0.2;
    } else if (objetivoUsuario === 1 && objetivoRutina === 3) {
        return 0.1;
    } else if (objetivoUsuario === 1 && objetivoRutina === 2) {
        return 0;
    } else if (objetivoUsuario === 3 && objetivoRutina === 1) {
        return 0.1;
    } else if (objetivoUsuario === 3 && objetivoRutina === 2) {
        return 0.05;
    } else if (objetivoUsuario === 2 && objetivoRutina === 1) {
        return 0;
    } else if (objetivoUsuario === 2 && objetivoRutina === 3) {
        return 0.05;
    } else {
        return 0; // Cubrir cualquier caso no especificado
    }
}

function mapearCondicionFisica(idCondicionFisica) {
    switch (idCondicionFisica) {
        case 1: 
            return 0;
        case 2: 
            return 0.5;
        case 3: 
            return 1;
        default:
            return 0; // Valor por defecto
    }
}

const calcularCoeficienteLesiones = (lesionesUsuario, ejerciciosRutina) => {
    // Si el usuario no tiene lesiones registradas, devuelve 0.1 por defecto
    if (lesionesUsuario.length === 0) return 0.1;

    // Verifica si algún ejercicio de la rutina puede afectar las lesiones del usuario
    let afectaLesion = ejerciciosRutina.some(ejercicio => lesionesUsuario.includes(ejercicio.ID_Lesion));

    // Devuelve 0.1 si afecta alguna lesión, de lo contrario 0
    return afectaLesion ? 0.1 : 0;
};

// Función para obtener los ejercicios de una rutina
const obtenerEjerciciosRutina = async (pool, ID_Rutina) => {
    const ejerciciosRutinaResult = await pool.request()
        .input('ID_Rutina', sql.Int, ID_Rutina)
        .query(`
            SELECT E.ID_Ejercicio, E.ID_Lesion
            FROM Ejercicio E
            INNER JOIN EjerciciosDia ED ON E.ID_Ejercicio = ED.ID_Ejercicio
            INNER JOIN Dias_Entreno DE ON ED.ID_Dias_Entreno = DE.ID_Dias_Entreno
            WHERE DE.ID_Rutina = @ID_Rutina
        `);
    return ejerciciosRutinaResult.recordset;
};

const obtenerEspacioDisponibleUsuario = async (pool, ID_UsuarioMovil) => {
    const espacioResult = await pool.request()
        .input('ID_UsuarioMovil', sql.Int, ID_UsuarioMovil)
        .query(`SELECT ID_EspacioDisponible FROM Cuestionario WHERE ID_UsuarioMovil = @ID_UsuarioMovil`);
    return espacioResult.recordset[0].ID_EspacioDisponible;
};

// Función para obtener el equipamiento que el usuario tiene disponible
const obtenerEquipamientoUsuario = async (pool, ID_Cuestionario) => {
    const equipamientoResult = await pool.request()
        .input('ID_Cuestionario', sql.Int, ID_Cuestionario)
        .query(`SELECT ID_Equipo FROM Dispone WHERE ID_Cuestionario = @ID_Cuestionario`);
    return equipamientoResult.recordset.map(equipo => equipo.ID_Equipo);
};

const calcularCoeficienteEquipo = (ID_EspacioDisponible, ID_EquiposUsuario, ejerciciosRutina) => {
    // Si entrena en un gimnasio, se le asigna el valor por defecto de 0.1
    if (ID_EspacioDisponible === 1) {
        return 0.1;
    }

    // Obtener la cantidad de ejercicios que no se pueden realizar con el equipo que el usuario dispone
    const ejerciciosNoDisponibles = ejerciciosRutina.filter(ejercicio => 
        !ID_EquiposUsuario.includes(ejercicio.ID_Equipo)
    ).length;

    // Calcular el coeficiente basado en la cantidad de ejercicios no disponibles
    const coeficiente = (ejerciciosRutina.length - ejerciciosNoDisponibles) / ejerciciosRutina.length * 0.1;

    return coeficiente;
};

const calcularCoeficienteMusculoPreferente = async (musculoPreferente, ejerciciosRutina) => {
    let contadorMusculoPreferente = 0;

    // Contar la presencia del músculo preferente en los ejercicios de la rutina
    ejerciciosRutina.forEach(ejercicio => {
        if (ejercicio.ID_Musculo === musculoPreferente) {
            contadorMusculoPreferente++;
        }
    });

    // Calcular el coeficiente basado en la cantidad de veces que aparece el músculo preferente
    if (contadorMusculoPreferente === 0) {
        return 0; // No aparece el músculo preferente
    } else if (contadorMusculoPreferente === 1) {
        return 0.033; // Aparece una vez
    } else if (contadorMusculoPreferente === 2) {
        return 0.066; // Aparece dos veces
    } else {
        return 0.1; // Aparece tres o más veces
    }
};

const obtenerMusculoPreferente = async (pool, ID_UsuarioMovil) => {
    try {
      // Obtener todas las rutinas asignadas al usuario en los últimos seis meses
      const rutinasAsignadasResult = await pool.request()
        .input('ID_UsuarioMovil', sql.Int, ID_UsuarioMovil)
        .query(`
          SELECT RA.ID_Rutina
          FROM Rutina_Asignada RA
          WHERE RA.ID_UsuarioMovil = @ID_UsuarioMovil
          AND RA.fecha_asignacion >= DATEADD(MONTH, -6, GETDATE())
        `);
  
      // Obtener los IDs de rutina en un arreglo
      const idsRutina = rutinasAsignadasResult.recordset.map(ra => ra.ID_Rutina);
  
      // Inicializar un objeto para contar la frecuencia de los músculos
      const frecuenciaMusculos = {};
  
      // Iterar sobre los IDs de rutina para obtener los músculos involucrados
      for (let idRutina of idsRutina) {
        const ejerciciosResult = await pool.request()
          .input('ID_Rutina', sql.Int, idRutina)
          .query(`
            SELECT E.ID_Musculo
            FROM Ejercicio E
            INNER JOIN EjerciciosDia ED ON E.ID_Ejercicio = ED.ID_Ejercicio
            INNER JOIN Dias_Entreno DE ON ED.ID_Dias_Entreno = DE.ID_Dias_Entreno
            WHERE DE.ID_Rutina = @ID_Rutina
          `);
  
        // Actualizar la frecuencia de los músculos
        ejerciciosResult.recordset.forEach(ej => {
          frecuenciaMusculos[ej.ID_Musculo] = (frecuenciaMusculos[ej.ID_Musculo] || 0) + 1;
        });
      }
  
      // Determinar el músculo preferente
      let musculoPreferente = null;
      let maxFrecuencia = 0;
  
      Object.entries(frecuenciaMusculos).forEach(([musculo, frecuencia]) => {
        if (frecuencia > maxFrecuencia) {
            maxFrecuencia = frecuencia;
            musculoPreferente = musculo;
        } else if (frecuencia === maxFrecuencia) {
            // En caso de empate, compara la importancia de los músculos
            if (importancias[musculo] < importancias[musculoPreferente]) {
                musculoPreferente = musculo;
            }
        }
    });
  
      return musculoPreferente;
    } catch (error) {
      console.error('Error al obtener el músculo preferente:', error);
      throw error;
    }
  };
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
