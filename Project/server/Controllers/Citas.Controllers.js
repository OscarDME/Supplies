import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";
import cron from "node-cron";

const actualizarEstadoCitasCompletadas = async () => {
  const pool = await getConnection();
  const now = new Date();
  const fechaActual = now.toISOString().slice(0, 10);
  const horaActual = now.toISOString().slice(11, 19);

  const query = `
      UPDATE Cita
      SET ID_EstadoCita = 4 -- Estado a 'completada'
      WHERE CONVERT(date, fecha) <= '${fechaActual}'
      AND CONVERT(time, hora_final) <= '${horaActual}'
      AND ID_EstadoCita = 2; -- Estado 'aceptada'
  `;

  try {
      await pool.request().query(query);
      console.log('Citas actualizadas a estado completado');
  } catch (error) {
      console.error('Error actualizando el estado de las citas:', error);
  }
};

cron.schedule('0 * * * *', actualizarEstadoCitasCompletadas);

export const createCita = async (req, res) => {
  try {
    const { ID_Usuario, ID_UsuarioCliente, fecha, hora_inicio, hora_final, lugar, detalles} = req.body;

    const pool = await getConnection();

    const mobileUserResult = await pool
    .request()
    .input("ID_Usuario", sql.VarChar, ID_UsuarioCliente)
    .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");

  const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;

  const webUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, ID_Usuario)
      .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");

    const ID_Usuario_WEB = webUserResult.recordset[0].ID_Usuario_WEB;

    const result = await pool.request()
      .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
      .input("ID_Usuario_WEB", sql.Int, ID_Usuario_WEB)
      .input("fecha", sql.Date, fecha)
      .input("hora_inicio", sql.Time, hora_inicio)
      .input("hora_final", sql.Time, hora_final)
      .input("lugar", sql.VarChar, lugar)
      .input("detalles", sql.VarChar, detalles)
      .query(querys.createCita);

    const ID_Cita = result.recordset[0].ID_Cita;

    res.status(201).json({ message: "Cita creada exitosamente", ID_Cita });
  } catch (error) {
    console.error("Error al crear la cita:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCitas = async (req, res) => {
    try {
      const ID_Usuario = req.params.id; // Asumiendo que el ID del usuario web se pasa como parámetro en la URL
      const pool = await getConnection();
      const webUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, ID_Usuario)
      .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");

      const ID_Usuario_WEB = webUserResult.recordset[0].ID_Usuario_WEB;
      
      const result = await pool.request()
        .input('ID_Usuario_WEB', sql.Int, ID_Usuario_WEB)
        .query(querys.getCitas);
      console.log("Resultado de la consulta:", result.recordset);
      res.json(result.recordset);
    } catch (error) {
      console.error("Error al obtener las citas para el usuario web:", error);
      res.status(500).json({ error: error.message });
    }
  };

  export const getCitasMobile = async (req, res) => {
    try {
      const ID_UsuarioCliente = req.params.id; // Asumiendo que el ID del usuario web se pasa como parámetro en la URL
      const pool = await getConnection();
      const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, ID_UsuarioCliente)
      .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
  
    const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
      
      const result = await pool.request()
        .input('ID_UsuarioMovil', sql.Int, ID_UsuarioMovil)
        .query(querys.getPendingCitas);
      console.log("Resultado de la consulta:", result.recordset);
      res.json(result.recordset);
    } catch (error) {
      console.error("Error al obtener las citas para el usuario web:", error);
      res.status(500).json({ error: error.message });
    }
  };

  export const getAcceptedCitasMobile = async (req, res) => {
    try {
      const ID_UsuarioCliente = req.params.id; // Asumiendo que el ID del usuario web se pasa como parámetro en la URL
      const pool = await getConnection();
      const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, ID_UsuarioCliente)
      .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
  
    const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
      
      const result = await pool.request()
        .input('ID_UsuarioMovil', sql.Int, ID_UsuarioMovil)
        .query(querys.getAcceptedCitasMobile);
      console.log("Resultado de la consulta:", result.recordset);
      res.json(result.recordset);
    } catch (error) {
      console.error("Error al obtener las citas para el usuario web:", error);
      res.status(500).json({ error: error.message });
    }
  };

  export const getAcceptedCitasMobileAndDate = async (req, res) => {
    try {
      const ID_UsuarioCliente = req.params.id; // Asumiendo que el ID del usuario web se pasa como parámetro en la URL
      const selectedDate = req.params.selectedDate; // Obtener la fecha seleccionada del parámetro de la URL
      const pool = await getConnection();
      const mobileUserResult = await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_UsuarioCliente)
        .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
  
      const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
  
      const query = `
        SELECT 
          C.ID_Cita, 
          CONVERT(char(10), C.fecha, 126) as fecha, 
          CONVERT(varchar, C.hora_inicio, 108) as hora_inicio, 
          CONVERT(varchar, C.hora_final, 108) as hora_final, 
          C.lugar, 
          C.detalles, 
          EC.estado, 
          UM.ID_UsuarioMovil, 
          U.nombre AS nombre_usuario_movil, 
          U.apellido AS apellido_usuario_movil, 
          U2.nombre AS nombre_usuario_web, 
          U2.apellido AS apellido_usuario_web, 
          TUW.tipo AS Tipo_Web 
        FROM 
          Cita C 
        INNER JOIN 
          EstadoCita EC ON C.ID_EstadoCita = EC.ID_EstadoCita 
        INNER JOIN 
          UsuarioMovil UM ON C.ID_UsuarioMovil = UM.ID_UsuarioMovil 
        INNER JOIN 
          Usuario U ON UM.ID_Usuario = U.ID_Usuario 
        INNER JOIN 
          Usuario_WEB UW ON C.ID_Usuario_WEB = UW.ID_Usuario_WEB 
        INNER JOIN 
          Usuario U2 ON UW.ID_Usuario = U2.ID_Usuario 
        LEFT JOIN 
          Tipo_Web TUW ON UW.ID_Tipo_WEB = TUW.ID_Tipo_WEB 
        WHERE 
          C.ID_UsuarioMovil = @ID_UsuarioMovil 
          AND 
          C.ID_EstadoCita = 2
          AND
          CONVERT(char(10), C.fecha, 126) = @selectedDate`; // Agregar la condición de fecha
  
      const result = await pool.request()
        .input('ID_UsuarioMovil', sql.Int, ID_UsuarioMovil)
        .input('selectedDate', sql.VarChar, selectedDate) // Pasar la fecha seleccionada como parámetro
        .query(query);
  
      console.log("Resultado de la consulta:", result.recordset);
      res.json(result.recordset);
    } catch (error) {
      console.error("Error al obtener las citas para el usuario web:", error);
      res.status(500).json({ error: error.message });
    }
  };
  

  export const getRejectedCitas = async (req, res) => {
    try {
      const ID_Usuario = req.params.id; // Asumiendo que el ID del usuario web se pasa como parámetro en la URL
      const pool = await getConnection();
      const webUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, ID_Usuario)
      .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");

      const ID_Usuario_WEB = webUserResult.recordset[0].ID_Usuario_WEB;
      
      const result = await pool.request()
        .input('ID_Usuario_WEB', sql.Int, ID_Usuario_WEB)
        .query(querys.getRejectedCitas);
      console.log("Resultado de la consulta:", result.recordset);
      res.json(result.recordset);
    } catch (error) {
      console.error("Error al obtener las citas para el usuario web:", error);
      res.status(500).json({ error: error.message });
    }
  };

  export const getAceptadasCitas = async (req, res) => {
    try {
      const ID_Usuario = req.params.id; // Asumiendo que el ID del usuario web se pasa como parámetro en la URL
      const pool = await getConnection();
      const webUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, ID_Usuario)
      .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");

      const ID_Usuario_WEB = webUserResult.recordset[0].ID_Usuario_WEB;
      
      const result = await pool.request()
        .input('ID_Usuario_WEB', sql.Int, ID_Usuario_WEB)
        .query(querys.getAceptadasCitas);
      console.log("Resultado de la consulta:", result.recordset);
      res.json(result.recordset);
    } catch (error) {
      console.error("Error al obtener las citas para el usuario web:", error);
      res.status(500).json({ error: error.message });
    }
  };

  export const aceptarCita = async (req, res) => {
    try {
      const ID_Cita = req.params.id; // Asumiendo que el ID de la cita se pasa como parámetro en la URL
  
      const pool = await getConnection();
  
      await pool.request()
        .input("ID_Cita", sql.Int, ID_Cita)
        .query(querys.updateAceptarCita); // Asegúrate de que esta consulta está definida en tu objeto `querys`
  
      res.json({ message: "Estado de la cita actualizado exitosamente a 'aceptada'" });
    } catch (error) {
      console.error("Error al actualizar el estado de la cita:", error);
      res.status(500).json({ error: error.message });
    }
  };

  export const rechazarCita = async (req, res) => {
    try {
      const ID_Cita = req.params.id; // Asumiendo que el ID de la cita se pasa como parámetro en la URL
  
      const pool = await getConnection();
  
      await pool.request()
        .input("ID_Cita", sql.Int, ID_Cita)
        .query(querys.updateRechazarCita); // Asegúrate de que esta consulta está definida en tu objeto `querys`
  
      res.json({ message: "Estado de la cita actualizado exitosamente a 'aceptada'" });
    } catch (error) {
      console.error("Error al actualizar el estado de la cita:", error);
      res.status(500).json({ error: error.message });
    }
  };

  export const cancelarCita = async (req, res) => {
    try {
      const ID_Cita = req.params.id; // Asumiendo que el ID de la cita se pasa como parámetro en la URL
  
      const pool = await getConnection();
  
      await pool.request()
        .input("ID_Cita", sql.Int, ID_Cita)
        .query(querys.updateCancelarCita); // Asegúrate de que esta consulta está definida en tu objeto `querys`
  
      res.json({ message: "Estado de la cita actualizado exitosamente a 'aceptada'" });
    } catch (error) {
      console.error("Error al actualizar el estado de la cita:", error);
      res.status(500).json({ error: error.message });
    }
  };

  export const pendienteCita = async (req, res) => {
    try {
      const ID_Cita = req.params.id; // Asumiendo que el ID de la cita se pasa como parámetro en la URL
  
      const pool = await getConnection();
  
      await pool.request()
        .input("ID_Cita", sql.Int, ID_Cita)
        .query(querys.updatePendienteCita); // Asegúrate de que esta consulta está definida en tu objeto `querys`
  
      res.json({ message: "Estado de la cita actualizado exitosamente a 'aceptada'" });
    } catch (error) {
      console.error("Error al actualizar el estado de la cita:", error);
      res.status(500).json({ error: error.message });
    }
  };

  export const completarCita = async (req, res) => {
    try {
      const ID_Cita = req.params.id; // Asumiendo que el ID de la cita se pasa como parámetro en la URL
  
      const pool = await getConnection();
  
      await pool.request()
        .input("ID_Cita", sql.Int, ID_Cita)
        .query(querys.updateCompletarCita); // Asegúrate de que esta consulta está definida en tu objeto `querys`
  
      res.json({ message: "Estado de la cita actualizado exitosamente a 'aceptada'" });
    } catch (error) {
      console.error("Error al actualizar el estado de la cita:", error);
      res.status(500).json({ error: error.message });
    }
  };

  export const actualizarCita = async (req, res) => {
    try {
        const id  = req.params.id; 
        const { ID_Usuario, ID_UsuarioCliente, fecha, hora_inicio, hora_final, lugar, detalles } = req.body;

        const pool = await getConnection();

        const mobileUserResult = await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_UsuarioCliente)
        .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");

        const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;

        const webUserResult = await pool
              .request()
              .input("ID_Usuario", sql.VarChar, ID_Usuario)
              .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");

        const ID_Usuario_WEB = webUserResult.recordset[0].ID_Usuario_WEB;

        await pool.request()
            .input('ID_Cita', sql.Int, id)
            .input('ID_UsuarioMovil', sql.Int, ID_UsuarioMovil)
            .input('ID_Usuario_WEB', sql.Int, ID_Usuario_WEB)
            .input('fecha', sql.Date, fecha)
            .input('hora_inicio', sql.Time, hora_inicio)
            .input('hora_final', sql.Time, hora_final)
            .input('lugar', sql.NVarChar, lugar) // Asumiendo que 'lugar' es un texto largo
            .input('detalles', sql.NVarChar, detalles)
            .input('ID_EstadoCita', sql.Int, 1) // Estableciendo el estado a 1 ("pendiente")
            .query(querys.updateCita); // Asumiendo que tienes esta consulta definida en tu objeto `querys`

        res.json({ message: "Cita actualizada exitosamente." });
    } catch (error) {
        console.error("Error al actualizar la cita:", error);
        res.status(500).json({ error: error.message });
    }
};






  