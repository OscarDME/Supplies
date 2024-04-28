import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";


export const createAlimento = async (req, res) => {
  try {
    const { nombre, calorias, peso, ID_Categoria, macronutrientes } = req.body;
    console.log("cATEGORIA: ",ID_Categoria);

    const pool = await getConnection();

    const insertAlimentoResult = await pool.request()
      .input("nombre", sql.NVarChar, nombre)
      .input("calorias", sql.Int, calorias)
      .input("peso", sql.Float, peso)
      .input("ID_Categoria", sql.Int, ID_Categoria)
      .query(querys.createAlimento);

    const ID_Alimento = insertAlimentoResult.recordset[0].ID_Alimento;

    if (macronutrientes && Array.isArray(macronutrientes) && macronutrientes.length > 0) {
      for (const { ID_Macronutriente, cantidad } of macronutrientes) {
        await pool.request()
          .input("ID_Alimento", sql.Int, ID_Alimento)
          .input("ID_Macronutriente", sql.Int, ID_Macronutriente)
          .input("cantidad", sql.Float, cantidad)
          .query(querys.createContiene);
      }
    }

    res.status(201).json({ message: "Alimento y macronutrientes asociados creados exitosamente" });
  } catch (error) {
    console.error("Error al crear el alimento y sus macronutrientes:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createAlimentoRequest = async (req, res) => {
  try {
    const { nombre, calorias, peso, ID_Categoria, macronutrientes } = req.body;
    console.log("cATEGORIA: ",ID_Categoria);

    const pool = await getConnection();

    const insertAlimentoResult = await pool.request()
      .input("nombre", sql.NVarChar, nombre)
      .input("calorias", sql.Int, calorias)
      .input("peso", sql.Float, peso)
      .input("ID_Categoria", sql.Int, ID_Categoria)
      .query(querys.createAlimentoRequest);

    const ID_Alimento = insertAlimentoResult.recordset[0].ID_Alimento;

    if (macronutrientes && Array.isArray(macronutrientes) && macronutrientes.length > 0) {
      for (const { ID_Macronutriente, cantidad } of macronutrientes) {
        await pool.request()
          .input("ID_Alimento", sql.Int, ID_Alimento)
          .input("ID_Macronutriente", sql.Int, ID_Macronutriente)
          .input("cantidad", sql.Float, cantidad)
          .query(querys.createContiene);
      }
    }

    res.status(201).json({ message: "Alimento y macronutrientes asociados creados exitosamente" });
  } catch (error) {
    console.error("Error al crear el alimento y sus macronutrientes:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllAlimentosWithMacronutrientes = async (req, res) => {
  try {
      const pool = await getConnection();
      
      const alimentosResult = await pool.request().query(querys.getAlimento); 
      
      const alimentos = alimentosResult.recordset;
      
      for (let alimento of alimentos) {
          const macronutrientesResult = await pool.request()
              .input('ID_Alimento', sql.Int, alimento.ID_Alimento)
              .query(querys.getContiene);

          alimento.macronutrientes = macronutrientesResult.recordset;
      }

      res.json(alimentos);
  } catch (error) {
      console.error("Error al obtener los alimentos y sus macronutrientes:", error);
      res.status(500).json({ error: error.message });
  }
};

export const getAllAlimentosWithMacronutrientesRequest = async (req, res) => {
  try {
      const pool = await getConnection();
      
      const alimentosResult = await pool.request().query(querys.getAlimentoRequest);
      const alimentos = alimentosResult.recordset;
      
      for (let alimento of alimentos) {
          const macronutrientesResult = await pool.request()
              .input('ID_Alimento', sql.Int, alimento.ID_Alimento)
              .query(querys.getContiene);

          alimento.macronutrientes = macronutrientesResult.recordset;
      }

      res.json(alimentos);
  } catch (error) {
      console.error("Error al obtener los alimentos y sus macronutrientes:", error);
      res.status(500).json({ error: error.message });
  }
};

export const updateAlimento = async (req, res) => {
  try {
      const { ID_Alimento, nombre, calorias, peso, ID_Categoria, macronutrientes } = req.body;

      const pool = await getConnection();

      await pool.request()
          .input('ID_Alimento', sql.Int, ID_Alimento)
          .input('nombre', sql.NVarChar, nombre)
          .input('calorias', sql.Int, calorias)
          .input('peso', sql.Float, peso)
          .input('ID_Categoria', sql.Int, ID_Categoria)
          .query(querys.updateAlimento);

      for (const macronutriente of macronutrientes) {
          await pool.request()
              .input('ID_Alimento', sql.Int, ID_Alimento)
              .input('ID_Macronutriente', sql.Int, macronutriente.ID_Macronutriente)
              .input('cantidad', sql.Float, macronutriente.cantidad)
              .query(querys.updateContiene);
      }
      res.json({ message: "Alimento y macronutrientes actualizados con éxito" });
  } catch (error) {
      console.error("Error al actualizar el alimento y sus macronutrientes:", error);
      res.status(500).json({ error: error.message });
  }
};

export const updateAndAcceptAlimento = async (req, res) => {
  try {
      const { ID_Alimento, nombre, calorias, peso, ID_Categoria, macronutrientes } = req.body;

      const pool = await getConnection();

      await pool.request()
          .input('ID_Alimento', sql.Int, ID_Alimento)
          .input('nombre', sql.NVarChar, nombre)
          .input('calorias', sql.Int, calorias)
          .input('peso', sql.Float, peso)
          .input('ID_Categoria', sql.Int, ID_Categoria)
          .query(querys.updateAlimentoRequest);

      for (const macronutriente of macronutrientes) {
          await pool.request()
              .input('ID_Alimento', sql.Int, ID_Alimento)
              .input('ID_Macronutriente', sql.Int, macronutriente.ID_Macronutriente)
              .input('cantidad', sql.Float, macronutriente.cantidad)
              .query(querys.updateContiene);
      }
      res.json({ message: "Alimento y macronutrientes actualizados con éxito" });
  } catch (error) {
      console.error("Error al actualizar el alimento y sus macronutrientes:", error);
      res.status(500).json({ error: error.message });
  }
};

export const updateEstadoAlimento = async (req, res) => {
  try {
    const  ID_Alimento  = req.params.id; 
    const pool = await getConnection();

    await pool.request()
      .input('ID_Alimento', sql.Int, ID_Alimento)
      .query(querys.upadateEstadoAlimento);

    res.json({ message: "Estado del ejercicio actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el estado del ejercicio:", error);
    res.status(500).json({ error: error.message });
  }
}; 

export const deleteAlimento = async (req, res) => {
  try {
    const ID_Alimento = req.params.id;

    const pool = await getConnection();

    await pool.request()
      .input('ID_Alimento', sql.Int, ID_Alimento)
      .query(querys.deleteAlimento);

    res.json({ message: "Alimento borrado correctamente" });
  } catch (error) {
    console.error("Error al borrar el alimento:", error);
    res.status(500).json({ error: error.message });
  }
};
