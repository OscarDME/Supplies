import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const getMaterials = async (req, res) => {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(querys.getMaterials); // Asegúrate de tener definida la consulta SQL en querys.getMaterials
      return res.json(result.recordset);
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
};