import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const get1RMForExercise = async (req, res) => {
  const ID_Usuario = req.params.id;
  const ID_Ejercicio = req.params.ejercicio;
  console.log(ID_Usuario);
  console.log(ID_Ejercicio);
  try {
    const pool = await getConnection();
    const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, ID_Usuario)
      .query(
        "SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario"
      );
    const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
    const result = await pool
      .request()
      .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
      .input("ID_Ejercicio", sql.Int, ID_Ejercicio)
      .query(querys.geT1RMForExercise);
    console.log(result.recordset);
    if (result.recordset.length === 0) {
      return res
        .status(404)
        .send("No se encontraron resultados para los parámetros dados.");
    }

    // Enviar el resultado
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener el 1RM para el ejercicio:", error);
    res.status(500).send(error.message);
  }
};

export const getHistorical1RMForExercise = async (req, res) => {
    const ID_Usuario = req.params.id;
    const ID_Ejercicio = req.params.ejercicio;
    console.log(ID_Usuario);
    console.log(ID_Ejercicio);
    try {
      const pool = await getConnection();
      const mobileUserResult = await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .query(
          "SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario"
        );
      const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
  
      const result = await pool
        .request()
        .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
        .input("ID_Ejercicio", sql.Int, ID_Ejercicio)
        .query(querys.getHistorical1RMForExercise); 
  
      console.log(result.recordset);
      if (result.recordset.length === 0) {
        return res.status(404).send("No se encontraron resultados para los parámetros dados.");
      }
        res.json(result.recordset);
    } catch (error) {
      console.error("Error al obtener el 1RM histórico para el ejercicio:", error);
      res.status(500).send(error.message);
    }
  };

  export const getHistorical1RMForTime = async (req, res) => {
    const ID_Usuario = req.params.id;
    const ID_Ejercicio = req.params.ejercicio;
    const escala = req.params.fecha;

    let diasParaRestar;
    switch (escala) {
        case 'semana': diasParaRestar = 7; break;
        case 'mes': diasParaRestar = 30; break;
        case 'tresMeses': diasParaRestar = 90; break;
        case 'seisMeses': diasParaRestar = 180; break;
        case 'unAno': diasParaRestar = 365; break;
        case 'tresAnos': diasParaRestar = 365 * 3; break;
        default: return res.status(400).send("Escala temporal no válida.");
    }

    try {
        const pool = await getConnection();
        const mobileUserResult = await pool
            .request()
            .input("ID_Usuario", sql.VarChar, ID_Usuario)
            .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
        const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;

        const modalidadResult = await pool
            .request()
            .input("ID_Ejercicio", sql.Int, ID_Ejercicio)
            .query("SELECT ID_Modalidad FROM Ejercicio WHERE ID_Ejercicio = @ID_Ejercicio");
        const ID_Modalidad = modalidadResult.recordset[0]?.ID_Modalidad;

        if (ID_Modalidad === 3) {
            // Consulta para ejercicios cardiovasculares
            const cardioQuery = `
            DECLARE @FechaInicio DATE = DATEADD(DAY, -${diasParaRestar}, GETDATE());
            DECLARE @FechaFin DATE = GETDATE();

            SELECT 
                CONVERT(char(10), RSU.fecha, 126) AS fecha, 
                (DATEPART(HOUR, RSU.tiempo) * 60) + DATEPART(MINUTE, RSU.tiempo) AS tiempo_en_minutos
                FROM ResultadoSeriesUsuario RSU
            INNER JOIN Serie S ON RSU.ID_Serie = S.ID_Serie 
            INNER JOIN ConjuntoSeries CS ON S.ID_Serie = CS.ID_Serie 
            INNER JOIN BloqueSets BS ON CS.ID_BloqueSets = BS.ID_BloqueSets 
            INNER JOIN EjerciciosDia ED ON BS.ID_EjerciciosDia = ED.ID_EjerciciosDia 
            INNER JOIN Dias_Entreno DE ON ED.ID_Dias_Entreno = DE.ID_Dias_Entreno 
            INNER JOIN Rutina_Asignada RA ON DE.ID_Rutina = RA.ID_Rutina 
            WHERE 
                RA.ID_UsuarioMovil = @ID_UsuarioMovil AND 
                ED.ID_Ejercicio = @ID_Ejercicio AND 
                RSU.fecha BETWEEN @FechaInicio AND @FechaFin
                AND RSU.completado = 1
            ORDER BY RSU.fecha`;

            const cardioResult = await pool
                .request()
                .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
                .input("ID_Ejercicio", sql.Int, ID_Ejercicio)
                .query(cardioQuery);
            console.log(cardioResult.recordset);
            if (cardioResult.recordset.length === 0) {
                return res.status(404).send("No se encontraron tiempos de entrenamiento cardiovasculares para los parámetros dados.");
            }
            res.json(cardioResult.recordset);
        } else {
            // Consulta para 1RM histórico de ejercicios no cardiovasculares
            const query = `
            DECLARE @FechaInicio DATE = DATEADD(DAY, -${diasParaRestar}, GETDATE());
            DECLARE @FechaFin DATE = GETDATE();
            ${querys.get1RMForDates}`;

            const result = await pool
                .request()
                .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
                .input("ID_Ejercicio", sql.Int, ID_Ejercicio)
                .query(query);

            if (result.recordset.length === 0) {
                return res.status(404).send("No se encontraron resultados para los parámetros dados.");
            }
            res.json(result.recordset);
        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send(error.message);
    }
};




export const get1RMForTime = async (req, res) => {
  const ID_Usuario = req.params.id;
  const ID_Ejercicio = req.params.ejercicio;
  const escala = req.params.fecha; // Obtiene la escala temporal desde la query de la solicitud

  console.log(ID_Usuario, ID_Ejercicio, escala);

  // Calcula @FechaInicio basado en la escala temporal
  let diasParaRestar;
  switch (escala) {
      case 'semana':
          diasParaRestar = 7;
          break;
      case 'mes':
          diasParaRestar = 30;
          break;
      case 'tresMeses':
          diasParaRestar = 90;
          break;
      case 'seisMeses':
          diasParaRestar = 180;
          break;
      case 'unAno':  //quiero
          diasParaRestar = 365;
          break;
      case 'tresAnos':   //necesito
          diasParaRestar = 365 * 3;
          break;
      default:
          return res.status(400).send("Escala temporal no válida.");
  }

  try {
      const pool = await getConnection();
      const mobileUserResult = await pool
          .request()
          .input("ID_Usuario", sql.VarChar, ID_Usuario)
          .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
      const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;

      // Ajusta la consulta para incluir la lógica de @FechaInicio y @FechaFin
      const query = `
      DECLARE @FechaInicio DATE = DATEADD(DAY, -${diasParaRestar}, GETDATE());
      DECLARE @FechaFin DATE = GETDATE();
      ${querys.get1RMForDatesWithValues}`;

      const result = await pool
          .request()
          .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
          .input("ID_Ejercicio", sql.Int, ID_Ejercicio)
          .query(query);

      console.log(result.recordset);
      if (result.recordset.length === 0) {
          return res.status(404).send("No se encontraron resultados para los parámetros dados.");
      }
      res.json(result.recordset);
  } catch (error) {
      console.error("Error al obtener el 1RM histórico para el ejercicio:", error);
      res.status(500).send(error.message);
  }
};

export const getWeights = async (req, res) => {
  const ID_Usuario = req.params.id;
  const ID_Ejercicio = req.params.ejercicio;
  const escala = req.params.fecha; // Obtiene la escala temporal desde la query de la solicitud

  console.log(ID_Usuario, ID_Ejercicio, escala);

  // Calcula @FechaInicio basado en la escala temporal
  let diasParaRestar;
  switch (escala) {
      case 'semana':
          diasParaRestar = 7;
          break;
      case 'mes':
          diasParaRestar = 30;
          break;
      case 'tresMeses':
          diasParaRestar = 90;
          break;
      case 'seisMeses':
          diasParaRestar = 180;
          break;
      case 'unAno':  //quiero
          diasParaRestar = 365;
          break;
      case 'tresAnos':   //necesito
          diasParaRestar = 365 * 3;
          break;
      default:
          return res.status(400).send("Escala temporal no válida.");
  }

  try {
      const pool = await getConnection();
      const mobileUserResult = await pool
          .request()
          .input("ID_Usuario", sql.VarChar, ID_Usuario)
          .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
      const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;

      // Ajusta la consulta para incluir la lógica de @FechaInicio y @FechaFin
      const query = `
      DECLARE @FechaInicio DATE = DATEADD(DAY, -${diasParaRestar}, GETDATE());
      DECLARE @FechaFin DATE = GETDATE();
      ${querys.getWeight}`;

      const result = await pool
          .request()
          .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
          .input("ID_Ejercicio", sql.Int, ID_Ejercicio)
          .query(query);

      console.log(result.recordset);
      if (result.recordset.length === 0) {
          return res.status(404).send("No se encontraron resultados para los parámetros dados.");
      }
      res.json(result.recordset);
  } catch (error) {
      console.error("Error al obtener el 1RM histórico para el ejercicio:", error);
      res.status(500).send(error.message);
  }
};

export const getAverageStrengthByAgeGroup = async (req, res) => {
    const id = req.params.id;
    const ejercicio = req.params.ejercicio;
  
    try {
      const pool = await getConnection();
      const userResult = await pool.request()
        .input("ID_Usuario", sql.VarChar, id)
        .query("SELECT sexo FROM Usuario WHERE ID_Usuario = @ID_Usuario");
  
      if (userResult.recordset.length === 0) {
        return res.status(404).send("No se encontró el usuario especificado.");
      }
  
      const { sexo } = userResult.recordset[0];
  
      const avgStrengthResult = await pool.request()
        .input("Sexo", sql.Char, sexo)
        .input("ID_Ejercicio", sql.Int, ejercicio)
        .query(querys.getAverageStrengthByAgeGroupAndExercise);

      console.log(avgStrengthResult.recordset);
      res.json(avgStrengthResult.recordset);
    } catch (error) {
      console.error("Error al obtener la fuerza absoluta promedio por rangos de edad y sexo:", error);
      res.status(500).send(error.message);
    }
  };

  export const getMaximumAbsoluteStrength = async (req, res) => {
    const id = req.params.id;
    const ejercicio = req.params.ejercicio;
      
    try {
      const pool = await getConnection();
      const userResult = await pool.request()
        .input("ID_Usuario", sql.VarChar, id)
        .query(`SELECT ID_UsuarioMovil, sexo, fecha_nacimiento FROM UsuarioMovil UM JOIN Usuario U ON UM.ID_Usuario = U.ID_Usuario WHERE UM.ID_Usuario = @ID_Usuario`);
      
      if (userResult.recordset.length === 0) {
        return res.status(404).send("No se encontró el usuario especificado.");
      }
  
      const { ID_UsuarioMovil, sexo, fecha_nacimiento } = userResult.recordset[0];
  
      const strengthResult = await pool.request()
        .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
        .input("ID_Ejercicio", sql.Int, ejercicio)
        .query(querys.getMaximumAbsoluteStrengthForExercise);
      
      if (strengthResult.recordset.length === 0) {
        return res.status(404).send("No se encontraron resultados para el ejercicio especificado.");
      }
  
      console.log(strengthResult.recordset);
      // Enviar el resultado
      res.json({ ...strengthResult.recordset[0], sexo, fecha_nacimiento });
    } catch (error) {
      console.error("Error al obtener la fuerza absoluta máxima para el ejercicio:", error);
      res.status(500).send(error.message);
    }
  };

  export const getAllMaximumAbsoluteStrength = async (req, res) => {
    const id = req.params.id;
    const ejercicio = req.params.ejercicio;
      
    try {
      const pool = await getConnection();
      const userResult = await pool.request()
        .input("ID_Usuario", sql.VarChar, id)
        .query(`SELECT ID_UsuarioMovil, sexo, fecha_nacimiento FROM UsuarioMovil UM JOIN Usuario U ON UM.ID_Usuario = U.ID_Usuario WHERE UM.ID_Usuario = @ID_Usuario`);
      
      if (userResult.recordset.length === 0) {
        return res.status(404).send("No se encontró el usuario especificado.");
      }
  
      const { ID_UsuarioMovil, sexo, fecha_nacimiento } = userResult.recordset[0];
  
      const strengthResult = await pool.request()
        .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
        .input("ID_Ejercicio", sql.Int, ejercicio)
        .query(querys.getAllMaxStrengthInAgeGroup);
      
      if (strengthResult.recordset.length === 0) {
        return res.status(404).send("No se encontraron resultados para el ejercicio especificado.");
      }
  
      console.log(strengthResult.recordset);
      // Enviar el resultado
      res.json({ ...strengthResult.recordset, sexo, fecha_nacimiento });
    } catch (error) {
      console.error("Error al obtener la fuerza absoluta máxima para el ejercicio:", error);
      res.status(500).send(error.message);
    }
  };
  
  
  


