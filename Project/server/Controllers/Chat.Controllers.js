import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";

export const getTrainersInfo = async (req, res) => {
    const EntrenadorID = req.params.Entrenador;
    const ClienteID = req.params.Cliente;
    console.log(EntrenadorID);
    console.log(ClienteID);
    try {
        const pool = await getConnection();

                // Obtener ID_UsuarioMovil del cliente
        const clientResult = await pool.request()
                .input("ID_Usuario", sql.VarChar, ClienteID)
                .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
            if (clientResult.recordset.length === 0) {
                return res.status(404).json({ message: "Cliente no encontrado." });
            }
        const ID_UsuarioMovil = clientResult.recordset[0].ID_UsuarioMovil;

        const trainerResult = await pool.request()
            .input("ID_Usuario", sql.VarChar, EntrenadorID)
            .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");
        if (clientResult.recordset.length === 0) {
            return res.status(404).json({ message: "Cliente no encontrado." });
        }
        const ID_Usuario_WEB = trainerResult.recordset[0].ID_Usuario_WEB;

        console.log(ID_UsuarioMovil);
        console.log(ID_Usuario_WEB);

        // Consulta para obtener la información básica de los entrenadores/nutricionistas
        const trainersResult = await pool.request()
        .input("ID_UsuarioMovil", sql.Int, ID_UsuarioMovil)
        .input("ID_Usuario_WEB", sql.Int, ID_Usuario_WEB)
        .query(`
        SELECT 
                UW.ID_Usuario_WEB, 
                U.nombre, 
                U.apellido, 
                UW.ID_Tipo_Web,
                UW.foto_perfil,
                UW.calificacion,
                UW.titulos,
                UW.trabajo_actual,
                UW.descripcion,
                UW.experiencia_laboral,
                UW.servicio,
                U.ID_Usuario,
                TW.tipo AS tipo_usuario_web,
                (CASE 
                    WHEN R.ID_UsuarioMovil IS NOT NULL THEN 'sí'
                    ELSE 'no'
                END) AS EsCliente
            FROM 
                Usuario_WEB UW
                JOIN Tipo_Web TW ON UW.ID_Tipo_Web = TW.ID_Tipo_Web
            JOIN 
                Usuario U ON UW.ID_Usuario = U.ID_Usuario
            LEFT JOIN 
                (SELECT * FROM EsCliente WHERE ID_UsuarioMovil = @ID_UsuarioMovil AND ID_EsCliente = 1) R ON UW.ID_Usuario_WEB = R.ID_Usuario_WEB
            WHERE 
                UW.ID_Usuario_WEB = @ID_Usuario_WEB;
        `);

        res.json(trainersResult);
    } catch (error) {
        console.error('Error al obtener la información de los entrenadores/nutricionistas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};