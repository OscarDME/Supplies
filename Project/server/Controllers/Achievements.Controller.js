import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const getConsistencyAchievements = async (req, res) => {
  try {
    const pool = await getConnection();
    const oid = req.params.id;

    const mobileUserResult = await pool
    .request()
    .input("ID_Usuario", sql.VarChar, oid)
    .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
    const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
    
    const result = await pool.request()
    .input("ID_UsuarioMovil", sql.VarChar, ID_UsuarioMovil)
    .query(`
    ;WITH SeriesPerWeek AS (
      SELECT
        DATEPART(ISO_WEEK, fecha) AS WeekNumber,
        DATEPART(YEAR, fecha) AS YearNumber,
        COUNT(*) AS TotalSeries,
        SUM(CAST(completado AS INT)) AS CompletedSeries
      FROM ResultadoSeriesUsuario
      WHERE ID_Rutina_Asignada IN (
        SELECT ID_Rutina_Asignada
        FROM Rutina_Asignada
        WHERE ID_UsuarioMovil = @ID_UsuarioMovil
      )
      GROUP BY DATEPART(ISO_WEEK, fecha), DATEPART(YEAR, fecha)
    )
    SELECT
      YearNumber,
      WeekNumber,
      CASE 
        WHEN TotalSeries = CompletedSeries THEN 1
        ELSE 0
      END AS IsWeekCompleted
    FROM SeriesPerWeek
    WHERE TotalSeries = CompletedSeries
    ORDER BY YearNumber DESC, WeekNumber DESC;
    `)

    res.status(200).json(result.recordset);
  }
  catch (error) {
    console.error("Error al consultar los logros por consistencia", error);
    res.status(500).json({ error: error.message });
  }
}

export const getCardiovascularTimeAchievements = async (req, res) => {
    try {
      const pool = await getConnection();
      const oid = req.params.id;
  
      const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, oid)
      .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
      const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
      
      const result = await pool.request()
      .input("ID_UsuarioMovil", sql.VarChar, ID_UsuarioMovil)
      .query(`
      WITH RankedResults AS (
        SELECT
          RSU.ID_ResultadoSeriesUsuario,
          RSU.ID_Serie,
          RSU.fecha,
          RSU.tiempo,
          ROW_NUMBER() OVER (
            PARTITION BY RSU.ID_Serie
            ORDER BY RSU.fecha DESC
          ) AS rn
        FROM ResultadoSeriesUsuario RSU
        INNER JOIN Rutina_Asignada RA ON RSU.ID_Rutina_Asignada = RA.ID_Rutina_Asignada
        WHERE RA.ID_UsuarioMovil = @ID_UsuarioMovil
      ),
      SeriesWithExercise AS (
        SELECT
          RR.ID_ResultadoSeriesUsuario,
          RR.ID_Serie,
          RR.fecha,
          RR.tiempo,
          RR.rn,
          E.ejercicio AS NombreEjercicio
        FROM RankedResults RR
        INNER JOIN ConjuntoSeries CS ON RR.ID_Serie = CS.ID_Serie
        INNER JOIN BloqueSets BS ON CS.ID_BloqueSets = BS.ID_BloqueSets
        INNER JOIN EjerciciosDia ED ON BS.ID_EjerciciosDia = ED.ID_EjerciciosDia
        INNER JOIN Ejercicio E ON ED.ID_Ejercicio = E.ID_Ejercicio
      )
      
      SELECT
        SWE.ID_ResultadoSeriesUsuario AS UltimoID,
        SWE.ID_Serie,
        SWE.fecha AS FechaUltimo,
        SWE.tiempo AS TiempoUltimo,
        SWE.NombreEjercicio,
        PRIOR_SWI.Fecha AS FechaPenultimo,
        PRIOR_SWI.Tiempo AS TiempoPenultimo
      FROM SeriesWithExercise SWE
      INNER JOIN SeriesWithExercise PRIOR_SWI ON SWE.ID_Serie = PRIOR_SWI.ID_Serie AND PRIOR_SWI.rn = SWE.rn + 1
      WHERE SWE.rn = 1 AND CAST(SWE.tiempo AS TIME) > CAST(PRIOR_SWI.tiempo AS TIME);
      `)
  
      res.status(200).json(result.recordset);
    }
    catch (error) {
      console.error("Error al consultar los logros por consistencia", error);
      res.status(500).json({ error: error.message });
    }
  }


  export const getCompoundTimeAchievements = async (req, res) => {
    try {
      const pool = await getConnection();
      const oid = req.params.id;
  
      const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, oid)
      .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
      const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
      
      const result = await pool.request()
      .input("ID_UsuarioMovil", sql.VarChar, ID_UsuarioMovil)
      .query(`
      WITH RankedResults AS (
        SELECT
          RSU.ID_ResultadoSeriesUsuario,
          RSU.ID_Serie,
          RSU.fecha,
          RSU.peso,
          ROW_NUMBER() OVER (
            PARTITION BY RSU.ID_Serie
            ORDER BY RSU.fecha DESC
          ) AS rn
        FROM ResultadoSeriesUsuario RSU
        INNER JOIN Rutina_Asignada RA ON RSU.ID_Rutina_Asignada = RA.ID_Rutina_Asignada
        WHERE (RA.ID_UsuarioMovil = @ID_UsuarioMovil)
          AND RSU.peso IS NOT NULL
    ),
    SeriesWithExercise AS (
      SELECT
        RR.ID_ResultadoSeriesUsuario,
        RR.ID_Serie,
        RR.fecha,
        RR.peso,
        RR.rn,
        E.ejercicio AS NombreEjercicio
      FROM RankedResults RR
      INNER JOIN ConjuntoSeries CS ON RR.ID_Serie = CS.ID_Serie
      INNER JOIN BloqueSets BS ON CS.ID_BloqueSets = BS.ID_BloqueSets
      INNER JOIN EjerciciosDia ED ON BS.ID_EjerciciosDia = ED.ID_EjerciciosDia
      INNER JOIN Ejercicio E ON ED.ID_Ejercicio = E.ID_Ejercicio
    )
    SELECT
      SWE.ID_ResultadoSeriesUsuario AS UltimoID,
      SWE.ID_Serie,
      SWE.fecha AS FechaUltimo,
      SWE.peso AS PesoUltimo,
      SWE.NombreEjercicio,
      PRIOR_SWI.fecha AS FechaPenultimo,
      PRIOR_SWI.peso AS PesoPenultimo
    FROM SeriesWithExercise SWE
    INNER JOIN SeriesWithExercise PRIOR_SWI ON SWE.ID_Serie = PRIOR_SWI.ID_Serie AND PRIOR_SWI.rn = SWE.rn + 1
    WHERE SWE.rn = 1 AND (SWE.peso - PRIOR_SWI.peso) >= 5;
    
      `)
  
      res.status(200).json(result.recordset);
    }
    catch (error) {
      console.error("Error al consultar los logros por mejora de pesos", error);
      res.status(500).json({ error: error.message });
    }
  }