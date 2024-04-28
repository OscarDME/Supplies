import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const getWorkoutSession = async (req, res) => {
  const ID_Usuario = req.params.id; // Asumiendo que obtienes estos valores de alguna manera
  const fecha = req.params.fecha; // Asumiendo que obtienes estos valores de alguna manera
  try {
      const pool = await getConnection();
      const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, ID_Usuario)
      .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
      const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
      const nextTrainingDateResult = await pool
        .request()
        .input('ID_UsuarioMovil', sql.VarChar, ID_UsuarioMovil)
        .input('FechaActual', sql.Date, fecha)
        .query(`
        SELECT MIN(RSU.fecha) AS NextTrainingDate
            FROM ResultadoSeriesUsuario RSU
            INNER JOIN Rutina_Asignada RA ON RSU.ID_Rutina_Asignada = RA.ID_Rutina_Asignada
            WHERE RA.ID_UsuarioMovil = @ID_UsuarioMovil AND RSU.fecha >= @FechaActual
        `);

      let nextTrainingDate = nextTrainingDateResult.recordset[0]?.NextTrainingDate;

      // Si no se encuentra una fecha de entrenamiento próxima, enviar un mensaje adecuado
      if (!nextTrainingDate) {
        return res.status(404).json({ message: "No hay entrenamientos planificados próximos." });
      }

      // Utiliza la fecha de entrenamiento próxima encontrada para obtener los detalles del entrenamiento
      const result = await pool.request()
        .input('ID_UsuarioMovil', sql.VarChar, ID_UsuarioMovil)
        .input('fecha', sql.Date, nextTrainingDate) // Usa la fecha próxima encontrada
        .query(querys.getWorkoutSessionDetails);

        const sessionDetails = result.recordset.map(row => ({
            idResultado: row.ID_ResultadoSeriesUsuario,
            id: row.ID_Serie,
            reps: row.repeticiones || 0,
            weight: row.peso || 0,
            time: parseTimeToSeconds(row.tiempo) || 0, 
            rest: row.descansoEnSegundos ||0,
            superset: row.superset,
            ID_SeriePrincipal: row.ID_SeriePrincipal,
            exerciseToWork: {
                id: row.ID_Ejercicio,
                name: row.nombreEjercicio,
                difficulty: row.dificultad,
                modalidad: row.Modalidad,
            }
        }));
        console.log(sessionDetails);
        res.json({
            nextTrainingDate: nextTrainingDate, // Fecha del próximo entrenamiento
            session: sessionDetails // Detalles de la sesión
        });
  } catch (error) {
      console.error("Error al obtener la sesión de entrenamiento:", error.message);
      res.status(500).json({ error: "Error interno del servidor" });
  }
};

const parseTimeToSeconds = (timeString) => {
    if (!timeString) {
        return 0;
    }

    const parts = timeString.split(':').map(Number);
    let seconds = 0;
    if (parts.length === 3) {
      // Formato HH:MM:SS
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // Formato MM:SS
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      // Solo segundos
      seconds = parts[0];
    }
    return seconds;
  };
  
 // Función para convertir segundos a formato TIME (HH:MM:SS)
const secondsToTimeFormat = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // Retorna el tiempo en formato HH:MM:SS, asegurándose de que cada unidad tenga dos dígitos
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const updateWorkoutSeries = async (req, res) => {
    const { ID_ResultadoSeriesUsuario, repeticiones, peso, tiempo, completado } = req.body;
    console.log(ID_ResultadoSeriesUsuario);
    // Convertir los segundos a formato TIME (HH:MM:SS)
    const tiempoFormatoTime = secondsToTimeFormat(tiempo);

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('ID_ResultadoSeriesUsuario', sql.Int, ID_ResultadoSeriesUsuario)
            .input('Repeticiones', sql.Int, repeticiones)
            .input('Peso', sql.Int, peso)
            // Usa la conversión de segundos a TIME aquí
            .input('Tiempo', sql.Time, tiempoFormatoTime)
            .input('Completado', sql.Bit, completado)
            .query(`
                UPDATE ResultadoSeriesUsuario
                SET repeticiones = @Repeticiones,
                    peso = @Peso,
                    tiempo = @Tiempo,
                    completado = @Completado
                WHERE ID_ResultadoSeriesUsuario = @ID_ResultadoSeriesUsuario
            `);
        
        res.json({ message: "Serie actualizada correctamente", data: result });
    } catch (error) {
        console.error("Error al actualizar la serie:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
