import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";



export const getJourney = async (req, res) => {
    try {
      const pool = await getConnection();
      const oid = req.params.id;
      
      const result = await pool.request()
      .input("ID_Usuario", sql.VarChar, oid)
      .query(`
      select Hora_Preferida, Lugar_Salida, Lugar_Gimnasio, Notificaciones_Activas
      from Viaje
      where ID_Usuario = @ID_Usuario
      `)
  
      res.status(200).json(result.recordset);
    }
    catch (error) {
      console.error("Error al consultar los datos de Viaje", error);
      res.status(500).json({ error: error.message });
    }
  }
  

  
export const updateJourney = async (req, res) => {
    try {
        const pool = await getConnection();
        const oid = req.params.id;
        
        const isExistent = await pool.request()
        .input("ID_Usuario", sql.VarChar, oid)
        .query("SELECT * FROM Viaje WHERE ID_Usuario = @ID_Usuario");
        
        if(!isExistent.recordset.length){
            await pool.request()
            .input("ID_Usuario", sql.VarChar, oid)
            .input("Hora_Preferida", sql.Time, req.body.Hora_Preferida)
            .input("Lugar_Salida", sql.VarChar, req.body.Lugar_Salida)
            .input("Lugar_Gimnasio", sql.VarChar, req.body.Lugar_Gimnasio)
            .input("Notificaciones_Activas", sql.Bit, req.body.Notificaciones_Activas)
            .input("Tiempo_Estimado", sql.Time, req.body.Tiempo_Estimado)
            .query("INSERT INTO Viaje (ID_Usuario, Hora_Preferida, Lugar_Salida, Lugar_Gimnasio, Notificaciones_Activas, Tiempo_Estimado) VALUES (@ID_Usuario, @Hora_Preferida, @Lugar_Salida, @Lugar_Gimnasio, @Notificaciones_Activas, @Tiempo_Estimado)");
        }
        else{
            await pool.request()
            .input("ID_Usuario", sql.VarChar, oid)
            .input("Hora_Preferida", sql.Time, req.body.Hora_Preferida)
            .input("Lugar_Salida", sql.VarChar, req.body.Lugar_Salida)
            .input("Lugar_Gimnasio", sql.VarChar, req.body.Lugar_Gimnasio)
            .input("Notificaciones_Activas", sql.Bit, req.body.Notificaciones_Activas)
            .input("Tiempo_Estimado", sql.Time, req.body.Tiempo_Estimado)
            .query("UPDATE Viaje SET Tiempo_Estimado=@Tiempo_Estimado, Hora_Preferida=@Hora_Preferida, Lugar_Salida=@Lugar_Salida, Lugar_Gimnasio=@Lugar_Gimnasio, Notificaciones_Activas=@Notificaciones_Activas WHERE ID_Usuario=@ID_Usuario");
        }
    
        res.status(201).json({ message: "Datos de Viaje agregados exitosamente"});
      } catch (error) {
        console.error("Error al modificar Viaje", error);
        res.status(500).json({ error: error.message });
      }
  }

  export const getNotifications = async (req, res) => {
    try {
      const pool = await getConnection();
      const oid = req.params.id;
      
      const result = await pool.request()
      .input("ID_Usuario", sql.VarChar, oid)
      .query(`
      SELECT
          v.ID_Usuario,
          v.Hora_Preferida,
          v.Tiempo_Estimado,
          DATEADD(MINUTE, -DATEDIFF(MINUTE, 0, v.Tiempo_Estimado), v.Hora_Preferida) AS Hora_De_Salida
      FROM
          Viaje v
      WHERE
          v.ID_Usuario = @ID_Usuario
          AND EXISTS (
              SELECT 1
              FROM Rutina_Asignada ra
              INNER JOIN UsuarioMovil um ON ra.ID_UsuarioMovil = um.ID_UsuarioMovil
              WHERE um.ID_Usuario = @ID_Usuario
                AND ra.fecha_inicio <= CAST(GETDATE() AS DATE)
                AND (ra.fecha_fin IS NULL OR ra.fecha_fin >= CAST(GETDATE() AS DATE))
                AND ra.fecha_eliminacion IS NULL
          );
      `)
  
      res.status(200).json(result.recordset);
    }
    catch (error) {
      console.error("Error al ahcer fetch de las notificaciones", error);
      res.status(500).json({ error: error.message });
    }
  }