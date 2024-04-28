import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";

export const createTrainerClientRequest = async (req, res) => {
  try {
    const { sender, receiver } = req.body; // Obtener el ID de usuario general

    const pool = await getConnection();

    // Consulta para obtener el ID de usuario móvil
    const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, receiver)
      .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");

    const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;

    // Consulta para obtener el ID de usuario web
    const webUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, sender)
      .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");

    const ID_Usuario_WEB = webUserResult.recordset[0].ID_Usuario_WEB;

    // Insertar la solicitud con los ID de usuario móvil y web obtenidos
    const requestResult = await pool
      .request()
      .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
      .input("ID_Usuario_WEB", sql.Int, ID_Usuario_WEB)
      .input("estado", sql.Bit, 1) // Estado inicial de la solicitud
      .query("INSERT INTO SolicitudEntrenadorCliente (ID_UsuarioMovil, ID_Usuario_WEB, estado) VALUES (@ID_UsuarioMovil, @ID_Usuario_WEB, @estado)");

    res.status(201).json({ message: "Solicitud creada correctamente" });
  } catch (error) {
    console.error('Error al crear la solicitud de entrenador a cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getPendingTrainerClientRequests = async (req, res) => {
    try {
        const { sender } = req.body; // Obtener el ID de usuario general que envió las solicitudes
    
        const pool = await getConnection();
    
        // Consulta para obtener el ID de usuario web del entrenador
        const webUserResult = await pool
            .request()
            .input("ID_Usuario", sql.VarChar, sender)
            .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");
    
        const ID_Usuario_WEB = webUserResult.recordset[0].ID_Usuario_WEB;
        console.log("ID_Usuario_WEB:", ID_Usuario_WEB); 
    
        // Consulta para obtener todas las solicitudes pendientes de aceptación enviadas por el usuario emisor (entrenador)
        const result = await pool
            .request()
            .input("ID_Usuario_WEB", sql.Int, ID_Usuario_WEB)
            .query(`
                SELECT 
                    U.ID_Usuario, 
                    U.nombre,
                    U.apellido,
                    U.correo,
                    U.sexo,
                    U.fecha_nacimiento,
                    T.descripcion AS tipo_usuario_movil
                FROM 
                    Usuario U
                    INNER JOIN UsuarioMovil UM ON U.ID_Usuario = UM.ID_Usuario
                    INNER JOIN SolicitudEntrenadorCliente SEC ON UM.ID_UsuarioMovil = SEC.ID_UsuarioMovil
                    INNER JOIN Usuario_WEB UW ON SEC.ID_Usuario_WEB = UW.ID_Usuario_WEB
                    INNER JOIN Tipo T ON UM.ID_Tipo = T.ID_Tipo
                WHERE 
                    SEC.estado = 1
                    AND UW.ID_Usuario_WEB = @ID_Usuario_WEB
            `);
        
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al cargar las solicitudes de entrenador a cliente pendientes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


export const deleteTrainerClientRequest = async (req, res) => {
    try {
        const { sender, eliminatingClientId } = req.body; // Obtener el ID del remitente y el ID del cliente a eliminar

        const pool = await getConnection();

        const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, eliminatingClientId)
      .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");

    const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;

    // Consulta para obtener el ID de usuario web
    const webUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, sender)
      .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");

    const ID_Usuario_WEB = webUserResult.recordset[0].ID_Usuario_WEB;

    console.log("ID_Usuario_WEB:", ID_Usuario_WEB); 
    console.log("ID_UsuarioMovil:", ID_UsuarioMovil);
        const result = await pool
            .request()
            .input("ID_Usuario_WEB", sql.VarChar, ID_Usuario_WEB)
            .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
            .query(`
                DELETE FROM SolicitudEntrenadorCliente 
                WHERE ID_Usuario_WEB = @ID_Usuario_WEB
                AND ID_UsuarioMovil = @ID_UsuarioMovil
            `);

        res.status(200).json({ message: "Solicitud de entrenador a cliente eliminada correctamente" });
    } catch (error) {
        console.error('Error al eliminar la solicitud de entrenador a cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getPendingClient = async (req, res) => {
    try {
        const receiver = req.params.oid; // Obtener el ID de usuario móvil que recibió las solicitudes
    
        const pool = await getConnection();

        const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, receiver)
      .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");

    const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;

        // Consulta para obtener todas las solicitudes pendientes de aceptación enviadas al usuario móvil
        const result = await pool
            .request()
            .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
            .query(`
                SELECT 
                    SEC.ID_SolicitudEntrenadorCliente,
                    U.nombre AS nombre_usuario_web,
                    U.apellido AS apellido_usuario_web,
                    T.tipo AS tipo_usuario_web
                FROM 
                    SolicitudEntrenadorCliente SEC
                    INNER JOIN UsuarioMovil UM ON SEC.ID_UsuarioMovil = UM.ID_UsuarioMovil
                    INNER JOIN Usuario_WEB UW ON SEC.ID_Usuario_WEB = UW.ID_Usuario_WEB
                    INNER JOIN Usuario U ON UW.ID_Usuario = U.ID_Usuario
                    INNER JOIN Tipo_Web T ON UW.ID_Tipo_Web = T.ID_Tipo_Web
                WHERE 
                    SEC.estado = 1
                    AND UM.ID_UsuarioMovil = @ID_UsuarioMovil
            `);
        console.log(result.recordset);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al cargar las solicitudes de cliente pendientes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const deleteTrainerClient = async (req, res) => {
    try {
        const  ID_SolicitudEntrenadorCliente  = req.params.id; // Obtener el ID de la solicitud a eliminar

        const pool = await getConnection();

        const result = await pool
            .request()
            .input("ID_SolicitudEntrenadorCliente", sql.Int, ID_SolicitudEntrenadorCliente)
            .query(`
                DELETE FROM SolicitudEntrenadorCliente 
                WHERE ID_SolicitudEntrenadorCliente = @ID_SolicitudEntrenadorCliente
            `);

        res.status(200).json({ message: "Solicitud de entrenador a cliente eliminada correctamente" });
    } catch (error) {
        console.error('Error al eliminar la solicitud de entrenador a cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const acceptClientRequest = async (req, res) => {
    try {
        const { requestId } = req.body; // Obtener el ID de la solicitud

        const pool = await getConnection();

        // Consulta para obtener la información de la solicitud
        const requestResult = await pool
            .request()
            .input("ID_SolicitudEntrenadorCliente", sql.Int, requestId)
            .query(`
                SELECT 
                    ID_Usuario_WEB,
                    ID_UsuarioMovil
                FROM 
                    SolicitudEntrenadorCliente
                WHERE 
                    ID_SolicitudEntrenadorCliente = @ID_SolicitudEntrenadorCliente
            `);

        const { ID_Usuario_WEB, ID_UsuarioMovil } = requestResult.recordset[0];

        // Insertar la relación en la tabla EsCliente
        const insertResult = await pool
            .request()
            .input("ID_Usuario_WEB", sql.Int, ID_Usuario_WEB)
            .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
            .query(`
                INSERT INTO EsCliente (ID_Usuario_WEB, ID_UsuarioMovil)
                VALUES (@ID_Usuario_WEB, @ID_UsuarioMovil)
            `);

        const updateResult = await pool
        .request()
        .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
        .query(`UPDATE UsuarioMovil SET ID_Tipo = 2 WHERE ID_UsuarioMovil = @ID_UsuarioMovil`);

        // Eliminar la solicitud después de aceptarla
        const deleteResult = await pool
            .request()
            .input("ID_SolicitudEntrenadorCliente", sql.Int, requestId)
            .query(`
                DELETE FROM SolicitudEntrenadorCliente 
                WHERE ID_SolicitudEntrenadorCliente = @ID_SolicitudEntrenadorCliente
            `);

        res.status(200).json({ message: "Solicitud aceptada y relación creada en EsCliente" });
    } catch (error) {
        console.error('Error al aceptar la solicitud y crear la relación en EsCliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
  
export const getTrainerInfo = async (req, res) => {
    try {
        const userOID = req.params.oid; // Obtener el ID de usuario móvil
        
        const pool = await getConnection();
        
        const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, userOID)
      .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");

    const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
        // Consulta para obtener la información del entrenador/nutricionista del usuario
        const result = await pool
            .request()
            .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
            .query(`
                SELECT 
                    U.nombre AS nombre_entrenador,
                    U.apellido AS apellido_entrenador,
                    TW.tipo AS tipo_usuario_web,
                    EC.calificacion AS calificacion_cliente 
                FROM 
                    EsCliente EC
                    INNER JOIN Usuario_WEB UW ON EC.ID_Usuario_WEB = UW.ID_Usuario_WEB
                    INNER JOIN Usuario U ON UW.ID_Usuario = U.ID_Usuario
                    INNER JOIN Tipo_Web TW ON UW.ID_Tipo_Web = TW.ID_Tipo_Web
                WHERE 
                    EC.ID_UsuarioMovil = @ID_UsuarioMovil
            `);
        console.log(result.recordset);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener la información del entrenador/nutricionista:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const updateClientRating = async (req, res) => {
    try {
        const { clientId, calificacion } = req.body; // Obtener el ID del cliente y la nueva calificación
        console.log(clientId, calificacion);
        const pool = await getConnection();

        const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, clientId)
      .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");

    const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
        // Consulta para actualizar la calificación del cliente en la tabla EsCliente
        const result = await pool
            .request()
            .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
            .input("calificacion", sql.Float, calificacion)
            .query(`
                UPDATE EsCliente
                SET calificacion = @calificacion
                WHERE ID_UsuarioMovil = @ID_UsuarioMovil    
            `);

        res.status(200).json({ message: "Calificación del cliente actualizada correctamente" });
    } catch (error) {
        console.error('Error al actualizar la calificación del cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getAllClientsOfTrainer = async (req, res) => {
    try {
        const userOID = req.params.oid;
        const pool = await getConnection();
        
        // Obtener el ID_Usuario_WEB del entrenador/nutricionista
        const webUserResult = await pool
            .request()
            .input("ID_Usuario", sql.VarChar, userOID)
            .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");

        if (webUserResult.recordset.length === 0) {
            return res.status(404).json({ message: "Entrenador/Nutricionista no encontrado." });
        }

        const ID_Usuario_WEB = webUserResult.recordset[0].ID_Usuario_WEB;
        
        // Obtener todos los ID_UsuarioMovil asociados a este entrenador/nutricionista y la información del usuario
        const clientsResult = await pool
            .request()
            .input("ID_Usuario_WEB", sql.Int, ID_Usuario_WEB)
            .query(`
                SELECT 
                    U.ID_Usuario, 
                    U.nombre,
                    U.apellido,
                    U.correo,
                    U.sexo,
                    U.fecha_nacimiento,
                    T.descripcion AS tipo_usuario_movil
                FROM 
                    EsCliente EC
                    INNER JOIN UsuarioMovil UM ON EC.ID_UsuarioMovil = UM.ID_UsuarioMovil
                    INNER JOIN Tipo T ON UM.ID_Tipo = T.ID_Tipo
                    INNER JOIN Usuario U ON UM.ID_Usuario = U.ID_Usuario
                WHERE 
                    EC.ID_Usuario_WEB = @ID_Usuario_WEB
            `);
            console.log(clientsResult.recordset);
        res.status(200).json(clientsResult.recordset);
    } catch (error) {
        console.error('Error al obtener los clientes del entrenador/nutricionista:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const deleteClientFromTrainer = async (req, res) => {
    try {
        // Asumiendo que recibes el ID_Usuario general del cliente y del entrenador/nutricionista
        const { clientUserID, trainerUserID } = req.body;

        const pool = await getConnection();

        // Obtener ID_UsuarioMovil del cliente
        const clientResult = await pool.request()
            .input("ID_Usuario", sql.VarChar, clientUserID)
            .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
        if (clientResult.recordset.length === 0) {
            return res.status(404).json({ message: "Cliente no encontrado." });
        }
        const ID_UsuarioMovil = clientResult.recordset[0].ID_UsuarioMovil;

        // Obtener ID_Usuario_WEB del entrenador/nutricionista
        const trainerResult = await pool.request()
            .input("ID_Usuario", sql.VarChar, trainerUserID)
            .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");
        if (trainerResult.recordset.length === 0) {
            return res.status(404).json({ message: "Entrenador/Nutricionista no encontrado." });
        }
        const ID_Usuario_WEB = trainerResult.recordset[0].ID_Usuario_WEB;

        // Realizar la eliminación en la tabla EsCliente
        const deleteResult = await pool.request()
            .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
            .input("ID_Usuario_WEB", sql.Int, ID_Usuario_WEB)
            .query(`
                DELETE FROM EsCliente
                WHERE ID_UsuarioMovil = @ID_UsuarioMovil AND ID_Usuario_WEB = @ID_Usuario_WEB
            `);

        
            const updateResult = await pool
            .request()
            .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
            .query(`UPDATE UsuarioMovil SET ID_Tipo = 1 WHERE ID_UsuarioMovil = @ID_UsuarioMovil`);

        if (deleteResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Relación entre entrenador y cliente no encontrada." });
        }

        res.json({ message: "Cliente eliminado del entrenador/nutricionista exitosamente." });
    } catch (error) {
        console.error('Error al eliminar el cliente del entrenador/nutricionista:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getAllTrainersInfo = async (req, res) => {
    try {
        const pool = await getConnection();

        // Consulta para obtener la información básica de los entrenadores/nutricionistas
        const trainersResult = await pool.request().query(`
            SELECT 
                UW.ID_Usuario_WEB, 
                UW.ID_Usuario,
                U.nombre, 
                U.apellido, 
                UW.foto_perfil, 
                UW.descripcion, 
                UW.experiencia_laboral, 
                UW.servicio,
                TW.tipo AS tipo_usuario_web
            FROM 
                Usuario_WEB UW
                JOIN Usuario U ON UW.ID_Usuario = U.ID_Usuario
                JOIN Tipo_Web TW ON UW.ID_Tipo_Web = TW.ID_Tipo_Web
            WHERE 
                TW.tipo IN ('Entrenador', 'Nutricionista')
        `);

        // Para cada entrenador/nutricionista, calcular el promedio de calificaciones de todos los usuarios de los que es cliente
        const trainersWithRatings = await Promise.all(trainersResult.recordset.map(async (trainer) => {
            const ratingsResult = await pool.request()
                .input('ID_Usuario_WEB', sql.Int, trainer.ID_Usuario_WEB)
                .query(`
                    SELECT AVG(EC.calificacion) AS promedio_calificacion
                    FROM 
                        EsCliente EC
                    WHERE 
                        EC.ID_Usuario_WEB = @ID_Usuario_WEB
                `);

            let promedio_calificacion = ratingsResult.recordset[0].promedio_calificacion;
            if(promedio_calificacion === null) {
                promedio_calificacion = "Sin calificaciones";
            }
            
            return {
                ...trainer,
                promedio_calificacion
            };
        }));

        res.json(trainersWithRatings);
    } catch (error) {
        console.error('Error al obtener la información de los entrenadores/nutricionistas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const createClientTrainerRequest = async (req, res) => {
    try {
      const { ID_Usuario_WEB, ID_Usuario } = req.body; // Recibes el ID de entrenador/nutricionista y el ID general del cliente
  
      const pool = await getConnection();
  
      // Buscar ID_UsuarioMovil con el ID_Usuario general del cliente
      const mobileUserResult = await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
  
      // Verificar que se encontró el usuario móvil
      if (mobileUserResult.recordset.length === 0) {
        return res.status(404).json({ message: "Usuario móvil no encontrado." });
      }
      const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
  
      // Insertar la solicitud cliente-entrenador
      const insertResult = await pool
        .request()
        .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
        .input("ID_Usuario_WEB", sql.Int, ID_Usuario_WEB)
        .input("estado", sql.Bit, 1) // Estado inicial de la solicitud
        .query(`
          INSERT INTO SolicitudClienteEntrenador (ID_UsuarioMovil, ID_Usuario_WEB, estado) 
          VALUES (@ID_UsuarioMovil, @ID_Usuario_WEB, @estado)
        `);
  
      res.status(201).json({ message: "Solicitud de cliente a entrenador creada correctamente" });
    } catch (error) {
      console.error('Error al crear la solicitud de cliente a entrenador:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
  export const getPendingRequestsForTrainer = async (req, res) => {
    try {
        const trainerId = req.params.trainerId; 
        const pool = await getConnection();

        const trainerResult = await pool.request()
        .input("ID_Usuario", sql.VarChar, trainerId)
        .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");
    if (trainerResult.recordset.length === 0) {
        return res.status(404).json({ message: "Entrenador/Nutricionista no encontrado." });
    }
    const ID_Usuario_WEB = trainerResult.recordset[0].ID_Usuario_WEB;

        const result = await pool.request()
            .input("ID_Usuario_WEB", sql.Int, ID_Usuario_WEB)
            .query(`
                SELECT 
                    UM.ID_UsuarioMovil,
                    U.ID_Usuario,
                    U.nombre,
                    U.apellido,
                    U.correo,
                    U.sexo,
                    U.fecha_nacimiento,
                    T.descripcion AS tipo_usuario_movil,
                    SCE.estado
                FROM 
                    SolicitudClienteEntrenador SCE
                    INNER JOIN UsuarioMovil UM ON SCE.ID_UsuarioMovil = UM.ID_UsuarioMovil
                    INNER JOIN Usuario U ON UM.ID_Usuario = U.ID_Usuario
                    INNER JOIN Tipo T ON UM.ID_Tipo = T.ID_Tipo
                WHERE 
                    SCE.ID_Usuario_WEB = @ID_Usuario_WEB
                    AND SCE.estado = 1
            `);

        if (result.recordset.length > 0) {
            console.log(result.recordset);
            res.json(result.recordset);
        } else {
            res.status(404).send('No se encontraron solicitudes pendientes para el entrenador/nutricionista especificado.');
        }
    } catch (error) {
        console.error('Error al obtener solicitudes pendientes para el entrenador/nutricionista:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const acceptClientTrainerRequest = async (req, res) => {
    try {
      const { senderOID, ID_Usuario_Movil } = req.body;
      const pool = await getConnection();
      const trainerResult = await pool.request()
      .input("ID_Usuario", sql.VarChar, senderOID)
      .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");
  if (trainerResult.recordset.length === 0) {
      return res.status(404).json({ message: "Entrenador/Nutricionista no encontrado." });
  }
  const ID_Usuario_WEB = trainerResult.recordset[0].ID_Usuario_WEB;
      // Insertar en EsCliente
      await pool.request()
        .input("ID_Usuario_WEB", sql.Int, ID_Usuario_WEB)
        .input("ID_UsuarioMovil", sql.Int, ID_Usuario_Movil)
        .query("INSERT INTO EsCliente (ID_Usuario_WEB, ID_UsuarioMovil) VALUES (@ID_Usuario_WEB, @ID_UsuarioMovil)");
  
      // Eliminar la solicitud correspondiente en SolicitudClienteEntrenador
      await pool.request()
        .input("ID_Usuario_WEB", sql.Int, ID_Usuario_WEB)
        .input("ID_UsuarioMovil", sql.Int, ID_Usuario_Movil)
        .query("DELETE FROM SolicitudClienteEntrenador WHERE ID_Usuario_WEB = @ID_Usuario_WEB AND ID_UsuarioMovil = @ID_UsuarioMovil");
  
      res.json({ message: "Solicitud aceptada y cliente agregado correctamente." });
    } catch (error) {
      console.error("Error al aceptar solicitud y agregar cliente:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  };

  export const deleteClientTrainerRequest = async (req, res) => {
    try {
      const { senderOID, ID_Usuario_Movil } = req.body;
      const pool = await getConnection();
      const trainerResult = await pool.request()
      .input("ID_Usuario", sql.VarChar, senderOID)
      .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");
  if (trainerResult.recordset.length === 0) {
      return res.status(404).json({ message: "Entrenador/Nutricionista no encontrado." });
  }
  const ID_Usuario_WEB = trainerResult.recordset[0].ID_Usuario_WEB;
      // Eliminar la solicitud
      await pool.request()
        .input("ID_Usuario_WEB", sql.Int, ID_Usuario_WEB)
        .input("ID_UsuarioMovil", sql.Int, ID_Usuario_Movil)
        .query("DELETE FROM SolicitudClienteEntrenador WHERE ID_Usuario_WEB = @ID_Usuario_WEB AND ID_UsuarioMovil = @ID_UsuarioMovil");
  
      res.json({ message: "Solicitud eliminada correctamente." });
    } catch (error) {
      console.error("Error al eliminar la solicitud:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  };
  
// Verificar si existe una solicitud pendiente entre dos usuarios
export const checkPendingRequest = async (req, res) => {
    try {
        const { senderOID, receiverID } = req.body; // senderOID es el ID de Usuario del entrenador/nutricionista, receiverID es 
        console.log("senderOID: ", senderOID);
        console.log("receiverID: ", receiverID);

        const pool = await getConnection();

        // Obtén el ID_Usuario_WEB del entrenador/nutricionista
        const webUserResult = await pool.request()
            .input("ID_Usuario", sql.VarChar, senderOID)
            .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");
        if (webUserResult.recordset.length === 0) {
            return res.status(404).json({ message: "Entrenador/nutricionista no encontrado." });
        }
        const ID_Usuario_WEB = webUserResult.recordset[0].ID_Usuario_WEB;
        console.log("IDS:", ID_Usuario_WEB);

        // Obtén el ID_UsuarioMovil del cliente
        const mobileUserResult = await pool.request()
            .input("ID_Usuario", sql.VarChar, receiverID)
            .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
        if (mobileUserResult.recordset.length === 0) {
            return res.status(404).json({ message: "Usuario móvil no encontrado." });
        }
        const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
         console.log("IDS:", ID_UsuarioMovil);
        const requestResult = await pool.request()
            .input("ID_Usuario_WEB", sql.Int, ID_Usuario_WEB)
            .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
            .query(`
                SELECT COUNT(*) AS existingRequests 
                FROM SolicitudEntrenadorCliente 
                WHERE ID_Usuario_WEB = @ID_Usuario_WEB 
                AND ID_UsuarioMovil = @ID_UsuarioMovil 
                AND estado = 1
            `);

        const exists = requestResult.recordset[0].existingRequests > 0;
        console.log("Existe solicitud:", exists);
        res.json({ exists }); // Devuelve true si existe al menos una solicitud pendiente, de lo contrario false
    } catch (error) {
        console.error('Error al verificar la existencia de solicitudes pendientes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const checkRequest = async (req, res) => {
    try {
        const { senderOID, receiverID } = req.body; // senderOID es el ID de Usuario del entrenador/nutricionista, receiverID es 
        console.log("senderOID: ", senderOID);
        console.log("receiverID: ", receiverID);

        const pool = await getConnection();

        // Obtén el ID_Usuario_WEB del entrenador/nutricionista

        // Obtén el ID_UsuarioMovil del cliente
        const mobileUserResult = await pool.request()
            .input("ID_Usuario", sql.VarChar, receiverID)
            .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
        if (mobileUserResult.recordset.length === 0) {
            return res.status(404).json({ message: "Usuario móvil no encontrado." });
        }
        const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
         console.log("IDS:", ID_UsuarioMovil);
        const requestResult = await pool.request()
            .input("ID_Usuario_WEB", sql.Int, senderOID)
            .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
            .query(`
                SELECT COUNT(*) AS existingRequests 
                FROM SolicitudClienteEntrenador 
                WHERE ID_Usuario_WEB = @ID_Usuario_WEB 
                AND ID_UsuarioMovil = @ID_UsuarioMovil 
                AND estado = 1
            `);

        const exists = requestResult.recordset[0].existingRequests > 0;
        console.log("Existe solicitud:", exists);
        res.json({ exists }); // Devuelve true si existe al menos una solicitud pendiente, de lo contrario false
    } catch (error) {
        console.error('Error al verificar la existencia de solicitudes pendientes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const insertTrainerNutritionistRequest = async (req, res) => {
    try {
        const {
            ID_Tipo_Web, // ID del tipo de servicio (Entrenador, Nutricionista, etc.)
            foto_perfil, // URL de la foto de perfil subida a Firebase Storage
            titulos, // URL de los títulos o certificaciones subidos a Firebase Storage
            trabajo_actual, // Descripción del trabajo actual
            descripcion, // Breve descripción personal
            experiencia_laboral, // Descripción de la experiencia laboral
            servicio, // Descripción del servicio que ofrece
            ID_Usuario // ID del usuario que realiza la solicitud
        } = req.body;

        const pool = await getConnection();

        await pool.request()
            .input("ID_Tipo_Web", sql.Int, ID_Tipo_Web)
            .input("foto_perfil", sql.VarChar, foto_perfil)
            .input("calificacion", sql.Float, null) // Asumiendo que la calificación se establecerá más adelante
            .input("titulos", sql.VarChar, titulos)
            .input("trabajo_actual", sql.VarChar, trabajo_actual)
            .input("descripcion", sql.VarChar, descripcion)
            .input("experiencia_laboral", sql.VarChar, experiencia_laboral)
            .input("servicio", sql.VarChar, servicio)
            .input("ID_Usuario", sql.VarChar, ID_Usuario)
            .input("estado_aceptado", sql.TinyInt, 0) // Asumiendo que el estado inicial es 'no aceptado' o 'pendiente'
            .query(`
                INSERT INTO Solicitud_WEB (ID_Tipo_Web, foto_perfil, calificacion, titulos, trabajo_actual, descripcion, experiencia_laboral, servicio, ID_Usuario, estado_aceptado)
                VALUES (@ID_Tipo_Web, @foto_perfil, @calificacion, @titulos, @trabajo_actual, @descripcion, @experiencia_laboral, @servicio, @ID_Usuario, @estado_aceptado)
            `);

        res.status(201).json({ message: "Solicitud creada correctamente" });
    } catch (error) {
        console.error('Error al crear la solicitud de entrenador/nutricionista:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getApplicationDetails = async (req, res) => {
    try {
        // Asume que el ID de la solicitud se recibe como parámetro de la ruta.
        const pool = await getConnection(); // Obtén tu conexión a la base de datos.

        const query = `
            SELECT 
                sw.ID_Solicitud_WEB, sw.foto_perfil, sw.calificacion, sw.titulos, sw.trabajo_actual, sw.descripcion, sw.experiencia_laboral, sw.servicio, sw.estado_aceptado,
                tw.tipo AS tipo_servicio,
                u.nombre, u.apellido, u.sexo, u.correo, u.fecha_nacimiento
            FROM Solicitud_WEB sw
            INNER JOIN Usuario_WEB uw ON sw.ID_Usuario = uw.ID_Usuario
            INNER JOIN Usuario u ON uw.ID_Usuario = u.ID_Usuario
            INNER JOIN Tipo_Web tw ON sw.ID_Tipo_Web = tw.ID_Tipo_Web
        `;

        const result = await pool.request()
            .query(query);

        if (result.recordset.length > 0) {
            console.log("Resultado:", result.recordset);
            res.json(result.recordset);
        } else {
            res.status(404).json({ message: "Detalles de la solicitud no encontrados." });
        }
    } catch (error) {
        console.error('Error al obtener los detalles de la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const acceptAndCreateTrainerNutritionist = async (req, res) => {
    const pool = await getConnection();

    try {
        const { ID_Solicitud_WEB } = req.body; // Asume que recibes el ID de la solicitud

        // 1. Obtener la información de la solicitud
        const solicitudResult = await pool.request()
            .input("ID_Solicitud_WEB", sql.Int, ID_Solicitud_WEB)
            .query("SELECT * FROM Solicitud_WEB WHERE ID_Solicitud_WEB = @ID_Solicitud_WEB");

        if (solicitudResult.recordset.length === 0) {
            return res.status(404).json({ message: "Solicitud no encontrada." });
        }

        const solicitud = solicitudResult.recordset[0];

        // 2. Crear el usuario web con los datos de la solicitud
        await pool.request()
            .input("ID_Tipo_Web", sql.Int, solicitud.ID_Tipo_Web)
            .input("foto_perfil", sql.VarChar, solicitud.foto_perfil)
            .input("calificacion", sql.Float, solicitud.calificacion) // Asumiendo null o un valor inicial
            .input("titulos", sql.VarChar, solicitud.titulos)
            .input("trabajo_actual", sql.VarChar, solicitud.trabajo_actual)
            .input("descripcion", sql.VarChar, solicitud.descripcion)
            .input("experiencia_laboral", sql.VarChar, solicitud.experiencia_laboral)
            .input("servicio", sql.VarChar, solicitud.servicio)
            .input("ID_Usuario", sql.VarChar, solicitud.ID_Usuario)
            .query(`
                INSERT INTO Usuario_WEB (ID_Tipo_Web, foto_perfil, calificacion, titulos, trabajo_actual, descripcion, experiencia_laboral, servicio, ID_Usuario)
                VALUES (@ID_Tipo_Web, @foto_perfil, @calificacion, @titulos, @trabajo_actual, @descripcion, @experiencia_laboral, @servicio, @ID_Usuario)
            `);

        // 3. Eliminar la solicitud
        await pool.request()
            .input("ID_Solicitud_WEB", sql.Int, ID_Solicitud_WEB)
            .query("DELETE FROM Solicitud_WEB WHERE ID_Solicitud_WEB = @ID_Solicitud_WEB");

        res.json({ message: "Solicitud aceptada y usuario web creado correctamente." });
    } catch (error) {
        console.error('Error al aceptar la solicitud y crear el usuario web:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const deleteSolicitudById = async (req, res) => {
    try {
        const ID_Solicitud_WEB = req.params.id; // Asume que recibes el ID de la solicitud como parámetro en la ruta
        console.log("ID_Solicitud_WEB:", ID_Solicitud_WEB);
        const pool = await getConnection();

        const deleteResult = await pool.request()
            .input("ID_Solicitud_WEB", sql.Int, ID_Solicitud_WEB)
            .query("DELETE FROM Solicitud_WEB WHERE ID_Solicitud_WEB = @ID_Solicitud_WEB");

        if (deleteResult.rowsAffected[0] > 0) {
            res.json({ message: "Solicitud eliminada correctamente." });
        } else {
            res.status(404).json({ message: "No se encontró la solicitud con el ID proporcionado." });
        }
    } catch (error) {
        console.error('Error al eliminar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};