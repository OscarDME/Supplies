import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const createEjercicio = async (req, res) => {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { ejercicio, preparacion, ejecucion, ID_Musculo, ID_Tipo_Ejercicio, ID_Dificultad, ID_Equipo, ID_Modalidad, ID_Lesion, musculosSecundarios  } = req.body;

    // Realizar la conexión a la base de datos
    const pool = await getConnection();

    // Insertar el nuevo ejercicio
    const insertEjercicioResult = await pool.request()
      .input("ejercicio", sql.NVarChar, ejercicio)
      .input("preparacion", sql.NVarChar, preparacion)
      .input("ejecucion", sql.NVarChar, ejecucion)
      .input("ID_Musculo", sql.Int, ID_Musculo)
      .input("ID_Tipo_Ejercicio", sql.Int, ID_Tipo_Ejercicio)
      .input("ID_Dificultad", sql.Int, ID_Dificultad)
      .input("ID_Equipo", sql.Int, ID_Equipo)
      .input("ID_Modalidad", sql.Int, ID_Modalidad)
      .input("ID_Lesion", sql.Int, ID_Lesion)
      .query(querys.createEjercicio);

    const ejercicioId = insertEjercicioResult.recordset[0].ID_Ejercicio;

    // Intentar insertar relaciones con músculos secundarios, si existen
    if (musculosSecundarios && musculosSecundarios.length > 0) {
      for (const ID_Musculo of musculosSecundarios) {
        await pool.request()
          .input("ID_Musculo", sql.Int, ID_Musculo)
          .input("ID_Ejercicio", sql.Int, ejercicioId)
          .query(querys.createTambienEntrena);
      }
    }

    res.status(201).json({ message: "Ejercicio creado correctamente, relaciones con músculos secundarios insertadas." });
  } catch (error) {
    console.error("Error en la creación del ejercicio:", error);
    res.status(500).json({ error: error.message });
  }
};

export const requestEjercicio = async (req, res) => {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { ejercicio, preparacion, ejecucion, ID_Musculo, ID_Tipo_Ejercicio, ID_Dificultad, ID_Equipo, ID_Modalidad, ID_Lesion, musculosSecundarios  } = req.body;

    // Realizar la conexión a la base de datos
    const pool = await getConnection();

    // Insertar el nuevo ejercicio
    const insertEjercicioResult = await pool.request()
      .input("ejercicio", sql.NVarChar, ejercicio)
      .input("preparacion", sql.NVarChar, preparacion)
      .input("ejecucion", sql.NVarChar, ejecucion)
      .input("ID_Musculo", sql.Int, ID_Musculo)
      .input("ID_Tipo_Ejercicio", sql.Int, ID_Tipo_Ejercicio)
      .input("ID_Dificultad", sql.Int, ID_Dificultad)
      .input("ID_Equipo", sql.Int, ID_Equipo)
      .input("ID_Modalidad", sql.Int, ID_Modalidad)
      .input("ID_Lesion", sql.Int, ID_Lesion)
      .query(querys.requestEjercicio);

    const ejercicioId = insertEjercicioResult.recordset[0].ID_Ejercicio;

    // Intentar insertar relaciones con músculos secundarios, si existen
    if (musculosSecundarios && musculosSecundarios.length > 0) {
      for (const ID_Musculo of musculosSecundarios) {
        await pool.request()
          .input("ID_Musculo", sql.Int, ID_Musculo)
          .input("ID_Ejercicio", sql.Int, ejercicioId)
          .query(querys.createTambienEntrena);
      }
    }

    res.status(201).json({ message: "Ejercicio creado correctamente, relaciones con músculos secundarios insertadas." });
  } catch (error) {
    console.error("Error en la creación del ejercicio:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getExercises = async (req, res) => {
    try {
        const pool = await getConnection();
        const request = pool.request();
        request.requestTimeout = 45000;
        const result = await pool.request().query(querys.getEjercicios);

        const exercises = result.recordset;
        for (let exercise of exercises) {
            // Para cada ejercicio, buscar sus músculos secundarios
            const musculosResult = await pool.request()
                .input('ID_Ejercicio', sql.Int, exercise.ID_Ejercicio)
                .query(querys.getMusculosSecundarios);
            exercise.musculosSecundarios = musculosResult.recordset;
        }


        res.json(exercises);
    } catch (error) {
        console.error("Error al obtener los ejercicios:", error);
        res.status(500).send(error.message);
    }
};

export const getRequests = async (req, res) => {
  try {
      const pool = await getConnection();
      const request = pool.request();
      request.requestTimeout = 45000;
      const result = await pool.request().query(querys.getRequests);

      const exercises = result.recordset;
      for (let exercise of exercises) {
          // Para cada ejercicio, buscar sus músculos secundarios
          const musculosResult = await pool.request()
              .input('ID_Ejercicio', sql.Int, exercise.ID_Ejercicio)
              .query(querys.getMusculosSecundarios);
          exercise.musculosSecundarios = musculosResult.recordset;
      }

      console.log(exercises);         

      res.json(exercises);
  } catch (error) {
      console.error("Error al obtener los ejercicios:", error);
      res.status(500).send(error.message);
  }
};

export const getEjercicioById = async (req, res) => {
  try {
      const  ID_Ejercicio  = req.params.id; 
      const pool = await getConnection();
      console.log(ID_Ejercicio);

      // Obtener el ejercicio por ID
      const result = await pool.request()
          .input('ID_Ejercicio', sql.Int, ID_Ejercicio)
          .query(querys.getEjerciciosById);

      if (result.recordset.length > 0) {
          const ejercicio = result.recordset[0];
          console.log(result);
          // Obtener los músculos secundarios asociados al ejercicio
          const musculosSecundariosResult = await pool.request()
              .input('ID_Ejercicio', sql.Int, ID_Ejercicio)
              .query(querys.getMusculosSecs); 
          console.log(musculosSecundariosResult);
          ejercicio.musculosSecundarios = musculosSecundariosResult.recordset;

          res.json(ejercicio);
      } else {
          res.status(404).json({ message: "Ejercicio no encontrado" });
      }
  } catch (error) {
      console.error("Error al obtener el ejercicio:", error);
      res.status(500).json({ error: error.message });
  }
};

export const updateEjercicio = async (req, res) => {
  try {
    const ID_Ejercicio = req.params.id; // Obtén el ID del ejercicio desde los parámetros de la URL
    const { ejercicio, preparacion, ejecucion, ID_Musculo, ID_Tipo_Ejercicio, ID_Dificultad, ID_Equipo, ID_Modalidad, ID_Lesion, musculosSecundarios } = req.body;
    console.log(musculosSecundarios);


    const pool = await getConnection();

    // Actualizar los datos principales del ejercicio
    await pool.request()
      .input('ID_Ejercicio', sql.Int, ID_Ejercicio)
      .input('ejercicio', sql.NVarChar, ejercicio)
      .input('preparacion', sql.NVarChar, preparacion)
      .input('ejecucion', sql.NVarChar, ejecucion)
      .input('ID_Musculo', sql.Int, ID_Musculo)
      .input('ID_Tipo_Ejercicio', sql.Int, ID_Tipo_Ejercicio)
      .input('ID_Dificultad', sql.Int, ID_Dificultad)
      .input('ID_Equipo', sql.Int, ID_Equipo)
      .input('ID_Modalidad', sql.Int, ID_Modalidad)
      .input('ID_Lesion', sql.Int, ID_Lesion)
      .query(querys.updateEjercicio);

    // Eliminar los músculos secundarios actuales para este ejercicio
    await pool.request()
      .input('ID_Ejercicio', sql.Int, ID_Ejercicio)
      .query('DELETE FROM TambienEntrena WHERE ID_Ejercicio = @ID_Ejercicio');

    // Insertar los nuevos músculos secundarios
    for (const musculo of musculosSecundarios) {
      await pool.request()
        .input('ID_Ejercicio', sql.Int, ID_Ejercicio)
        .input('ID_Musculo', sql.Int, musculo.ID_Musculo)
        .query('INSERT INTO TambienEntrena (ID_Ejercicio, ID_Musculo) VALUES (@ID_Ejercicio, @ID_Musculo)');
    }

    res.json({ message: "Ejercicio actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el ejercicio:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const ID_Ejercicio = req.params.id; // Obtén el ID del ejercicio desde los parámetros de la URL
    const { ejercicio, preparacion, ejecucion, ID_Musculo, ID_Tipo_Ejercicio, ID_Dificultad, ID_Equipo, ID_Modalidad, ID_Lesion, musculosSecundarios } = req.body;

    console.log(musculosSecundarios);

    const pool = await getConnection();

    // Actualizar los datos principales del ejercicio
    await pool.request()
      .input('ID_Ejercicio', sql.Int, ID_Ejercicio)
      .input('ejercicio', sql.NVarChar, ejercicio)
      .input('preparacion', sql.NVarChar, preparacion)
      .input('ejecucion', sql.NVarChar, ejecucion)
      .input('ID_Musculo', sql.Int, ID_Musculo)
      .input('ID_Tipo_Ejercicio', sql.Int, ID_Tipo_Ejercicio)
      .input('ID_Dificultad', sql.Int, ID_Dificultad)
      .input('ID_Equipo', sql.Int, ID_Equipo)
      .input('ID_Modalidad', sql.Int, ID_Modalidad)
      .input('ID_Lesion', sql.Int, ID_Lesion)
      .query(querys.updateRequest);

    // Eliminar los músculos secundarios actuales para este ejercicio
    await pool.request()
      .input('ID_Ejercicio', sql.Int, ID_Ejercicio)
      .query('DELETE FROM TambienEntrena WHERE ID_Ejercicio = @ID_Ejercicio');

    // Insertar los nuevos músculos secundarios
    for (const musculo of musculosSecundarios) {
      await pool.request()
        .input('ID_Ejercicio', sql.Int, ID_Ejercicio)
        .input('ID_Musculo', sql.Int, musculo.ID_Musculo)
        .query('INSERT INTO TambienEntrena (ID_Ejercicio, ID_Musculo) VALUES (@ID_Ejercicio, @ID_Musculo)');
    }

    res.json({ message: "Ejercicio actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el ejercicio:", error);
    res.status(500).json({ error: error.message });
  }
};



export const getAlternativeExercises = async (req, res) => {
  const  ID_Musculo  = req.params.id; // Asumiendo que pasas el ID del músculo como parámetro en la ruta

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('ID_Musculo', sql.VarChar, ID_Musculo)
      .query(querys.getAlternativas);
      
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener ejercicios alternativos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateEstadoEjercicio = async (req, res) => {
  try {
    const  ID_Ejercicio  = req.params.id; 
    const pool = await getConnection();

    await pool.request()
      .input('ID_Ejercicio', sql.Int, ID_Ejercicio)
      .query(querys.updateEstado);

    res.json({ message: "Estado del ejercicio actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el estado del ejercicio:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteEjercicio = async (req, res) => {
  try {
    const ID_Ejercicio = req.params.id; 
    const pool = await getConnection();

    await pool.request()
      .input('ID_Ejercicio', sql.Int, ID_Ejercicio)
      .query(querys.deleteEjercicio);

    res.json({ message: "Ejercicio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el ejercicio:", error);
    res.status(500).json({ error: error.message });
  }
};
