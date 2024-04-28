import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const createReceta = async (req, res) => {
  const {
    receta,
    calorias,
    preparacion,
    link,
    ID_Clasificacion,
    ingredientes,
  } = req.body;

  try {
    const pool = await getConnection();

    let caloriasTotales = 0;

    // Calcular las calorías totales de la receta
    for (const { ID_Alimento, porcion } of ingredientes) {
      const result = await pool.request()
        .input('ID_Alimento', sql.Int, ID_Alimento)
        .query(querys.getAlimentoById); // Asegúrate de tener esta consulta SQL

      const caloriasPorGramo = result.recordset[0].calorias / result.recordset[0].peso;
      caloriasTotales += caloriasPorGramo * porcion;
    }

    // Insertar receta
    const insertRecetaResult = await pool
      .request()
      .input("receta", sql.NVarChar, receta)
      .input("calorias", sql.Int, caloriasTotales)
      .input("preparacion", sql.NVarChar, preparacion)
      .input("link", sql.NVarChar, link)
      .query(querys.createReceta);

    const ID_Receta = insertRecetaResult.recordset[0].ID_Receta;

    let totalesMacronutrientes = {
      1: 0, // Grasas
      2: 0, // Carbohidratos
      3: 0, // Proteina
    };

    // Insertar ingredientes y calcular macronutrientes
    for (const { ID_Alimento, porcion } of ingredientes) {
      await pool
        .request()
        .input("ID_Receta", sql.Int, ID_Receta)
        .input("ID_Alimento", sql.Int, ID_Alimento)
        .input("porcion", sql.Float, porcion)
        .query(querys.createTieneIngredientes);

      // Obtener macronutrientes del ingrediente
      const macronutrientesResult = await pool
        .request()
        .input("ID_Alimento", sql.Int, ID_Alimento)
        .query(querys.getContieneById);
      console.log(macronutrientesResult.recordset);

      // Calcular totales
      macronutrientesResult.recordset.forEach(
        ({ ID_Macronutriente, cantidad }) => {
          totalesMacronutrientes[ID_Macronutriente] +=
            cantidad * (porcion / 100); // Asumiendo que la cantidad está por cada 100g
          console.log(totalesMacronutrientes);
        }
      );
    }

    // Insertar totales de macronutrientes
    for (const ID_Macronutriente in totalesMacronutrientes) {
      if (totalesMacronutrientes.hasOwnProperty(ID_Macronutriente)) {
        await pool
          .request()
          .input("ID_Receta", sql.Int, ID_Receta)
          .input("ID_Macronutriente", sql.Int, ID_Macronutriente)
          .input(
            "cantidad",
            sql.Float,
            totalesMacronutrientes[ID_Macronutriente]
          )
          .query(querys.createObtiene);
      }
    }

    let totalGramos = totalesMacronutrientes[1] + totalesMacronutrientes[2] + totalesMacronutrientes[3];

       // Calcular el porcentaje de cada macronutriente
       let porcentajeProteinas = (totalesMacronutrientes[3] / totalGramos) * 100;
       let porcentajeCarbohidratos = (totalesMacronutrientes[2] / totalGramos) * 100;
       let porcentajeGrasas = (totalesMacronutrientes[1] / totalGramos) * 100;
       console.log(porcentajeProteinas);
       console.log(porcentajeCarbohidratos);
       console.log(porcentajeGrasas);
   
     //   const porcentajeProteinas =
     //   ((totalesMacronutrientes[3] * 4) / calorias) * 100;
     // const porcentajeCarbohidratos =
     //   ((totalesMacronutrientes[2] * 4) / calorias) * 100;
     // const porcentajeGrasas = ((totalesMacronutrientes[1] * 9) / calorias) * 100;
   
    let ID_ClasificacionProteinas = 0; // ID de clasificación inicial
    let ID_ClasificacionCarbohidratos = 0; // ID de clasificación inicial
    let ID_ClasificacionGrasas = 0; // ID de clasificación inicial

    // Clasificación basada en proteínas
    if (porcentajeProteinas > 25) {
      ID_ClasificacionProteinas = 1; // Alto en proteínas
    } else if (porcentajeProteinas >= 15 && porcentajeProteinas <= 25) {
      ID_ClasificacionProteinas = 2; // Medio en proteínas
    } else {
      ID_ClasificacionProteinas = 3; // Bajo en proteínas
    }

    // Clasificación basada en carbohidratos
    if (porcentajeCarbohidratos > 55) {
      ID_ClasificacionCarbohidratos = 7; // Alto en carbohidratos
    } else if (porcentajeCarbohidratos >= 40 && porcentajeCarbohidratos <= 55) {
      ID_ClasificacionCarbohidratos = 8; // Medio en carbohidratos
    } else if (porcentajeCarbohidratos < 40) {
      ID_ClasificacionCarbohidratos = 9; // Bajo en carbohidratos
    }

    // Clasificación basada en grasas
    if (porcentajeGrasas > 40) {
      ID_ClasificacionGrasas = 4; // Alto en grasas
    } else if (porcentajeGrasas >= 30 && porcentajeGrasas <= 40) {
      ID_ClasificacionGrasas = 5; // Medio en grasas
    } else {
      ID_ClasificacionGrasas = 6; // Bajo en grasas
    }

    // Insertar clasificación de la receta
    await pool
      .request()
      .input("ID_Receta", sql.Int, ID_Receta)
      .input("ID_Clasificacion", sql.Int, ID_ClasificacionProteinas)
      .query(querys.createClasificaReceta);
    // Insertar clasificación de la receta
    await pool
      .request()
      .input("ID_Receta", sql.Int, ID_Receta)
      .input("ID_Clasificacion", sql.Int, ID_ClasificacionGrasas)
      .query(querys.createClasificaReceta);
    
    // Insertar clasificación de la receta
    await pool
      .request()
      .input("ID_Receta", sql.Int, ID_Receta)
      .input("ID_Clasificacion", sql.Int, ID_ClasificacionCarbohidratos)
      .query(querys.createClasificaReceta);

    res.status(201).json({ message: "Receta agregada con éxito" });
  } catch (error) {
    console.error("Error al agregar la receta:", error);
    res.status(500).json({ error: "Error al agregar la receta" });
  }
};

export const createRecetaRequest = async (req, res) => {
  const {
    receta,
    calorias,
    preparacion,
    link,
    ID_Clasificacion,
    ingredientes,
  } = req.body;

  try {
    const pool = await getConnection();

    let caloriasTotales = 0;

    // Calcular las calorías totales de la receta
    for (const { ID_Alimento, porcion } of ingredientes) {
      const result = await pool.request()
        .input('ID_Alimento', sql.Int, ID_Alimento)
        .query(querys.getAlimentoById); // Asegúrate de tener esta consulta SQL

      const caloriasPorGramo = result.recordset[0].calorias / result.recordset[0].peso;
      caloriasTotales += caloriasPorGramo * porcion;
    }

    // Insertar receta
    const insertRecetaResult = await pool
      .request()
      .input("receta", sql.NVarChar, receta)
      .input("calorias", sql.Int, caloriasTotales)
      .input("preparacion", sql.NVarChar, preparacion)
      .input("link", sql.NVarChar, link)
      .query(querys.requestReceta);

    const ID_Receta = insertRecetaResult.recordset[0].ID_Receta;

    let totalesMacronutrientes = {
      1: 0, // Grasas
      2: 0, // Carbohidratos
      3: 0, // Proteina
    };

    // Insertar ingredientes y calcular macronutrientes
    for (const { ID_Alimento, porcion } of ingredientes) {
      await pool
        .request()
        .input("ID_Receta", sql.Int, ID_Receta)
        .input("ID_Alimento", sql.Int, ID_Alimento)
        .input("porcion", sql.Float, porcion)
        .query(querys.createTieneIngredientes);

      // Obtener macronutrientes del ingrediente
      const macronutrientesResult = await pool
        .request()
        .input("ID_Alimento", sql.Int, ID_Alimento)
        .query(querys.getContieneById);
      console.log(macronutrientesResult.recordset);

      // Calcular totales
      macronutrientesResult.recordset.forEach(
        ({ ID_Macronutriente, cantidad }) => {
          totalesMacronutrientes[ID_Macronutriente] +=
            cantidad * (porcion / 100); // Asumiendo que la cantidad está por cada 100g
          console.log(totalesMacronutrientes);
        }
      );
    }

    // Insertar totales de macronutrientes
    for (const ID_Macronutriente in totalesMacronutrientes) {
      if (totalesMacronutrientes.hasOwnProperty(ID_Macronutriente)) {
        await pool
          .request()
          .input("ID_Receta", sql.Int, ID_Receta)
          .input("ID_Macronutriente", sql.Int, ID_Macronutriente)
          .input(
            "cantidad",
            sql.Float,
            totalesMacronutrientes[ID_Macronutriente]
          )
          .query(querys.createObtiene);
      }
    }

    let totalGramos = totalesMacronutrientes[1] + totalesMacronutrientes[2] + totalesMacronutrientes[3];

       // Calcular el porcentaje de cada macronutriente
       let porcentajeProteinas = (totalesMacronutrientes[3] / totalGramos) * 100;
       let porcentajeCarbohidratos = (totalesMacronutrientes[2] / totalGramos) * 100;
       let porcentajeGrasas = (totalesMacronutrientes[1] / totalGramos) * 100;
       console.log(porcentajeProteinas);
       console.log(porcentajeCarbohidratos);
       console.log(porcentajeGrasas);
   
     //   const porcentajeProteinas =
     //   ((totalesMacronutrientes[3] * 4) / calorias) * 100;
     // const porcentajeCarbohidratos =
     //   ((totalesMacronutrientes[2] * 4) / calorias) * 100;
     // const porcentajeGrasas = ((totalesMacronutrientes[1] * 9) / calorias) * 100;
   
    let ID_ClasificacionProteinas = 0; // ID de clasificación inicial
    let ID_ClasificacionCarbohidratos = 0; // ID de clasificación inicial
    let ID_ClasificacionGrasas = 0; // ID de clasificación inicial

    // Clasificación basada en proteínas
    if (porcentajeProteinas > 25) {
      ID_ClasificacionProteinas = 1; // Alto en proteínas
    } else if (porcentajeProteinas >= 15 && porcentajeProteinas <= 25) {
      ID_ClasificacionProteinas = 2; // Medio en proteínas
    } else {
      ID_ClasificacionProteinas = 3; // Bajo en proteínas
    }

    // Clasificación basada en carbohidratos
    if (porcentajeCarbohidratos > 55) {
      ID_ClasificacionCarbohidratos = 7; // Alto en carbohidratos
    } else if (porcentajeCarbohidratos >= 40 && porcentajeCarbohidratos <= 55) {
      ID_ClasificacionCarbohidratos = 8; // Medio en carbohidratos
    } else if (porcentajeCarbohidratos < 40) {
      ID_ClasificacionCarbohidratos = 9; // Bajo en carbohidratos
    }

    // Clasificación basada en grasas
    if (porcentajeGrasas > 40) {
      ID_ClasificacionGrasas = 4; // Alto en grasas
    } else if (porcentajeGrasas >= 30 && porcentajeGrasas <= 40) {
      ID_ClasificacionGrasas = 5; // Medio en grasas
    } else {
      ID_ClasificacionGrasas = 6; // Bajo en grasas
    }

    // Insertar clasificación de la receta
    await pool
      .request()
      .input("ID_Receta", sql.Int, ID_Receta)
      .input("ID_Clasificacion", sql.Int, ID_ClasificacionProteinas)
      .query(querys.createClasificaReceta);
    // Insertar clasificación de la receta
    await pool
      .request()
      .input("ID_Receta", sql.Int, ID_Receta)
      .input("ID_Clasificacion", sql.Int, ID_ClasificacionGrasas)
      .query(querys.createClasificaReceta);
    
    // Insertar clasificación de la receta
    await pool
      .request()
      .input("ID_Receta", sql.Int, ID_Receta)
      .input("ID_Clasificacion", sql.Int, ID_ClasificacionCarbohidratos)
      .query(querys.createClasificaReceta);

    res.status(201).json({ message: "Receta agregada con éxito" });
  } catch (error) {
    console.error("Error al agregar la receta:", error);
    res.status(500).json({ error: "Error al agregar la receta" });
  }
};

export const getReceta = async (req, res) => {
  try {
    const pool = await getConnection();
    let recetas = [];

    // Obtener todas las recetas básicas
    const resultRecetas = await pool.request().query(querys.getReceta);
    console.log(resultRecetas.recordset);
    const recetasBasics = resultRecetas.recordset;

    for (const receta of recetasBasics) {
      let recetaDetails = { ...receta };

      // Obtener ingredientes de la receta
      console.log(receta.ID_Receta);
      const resultIngredientes = await pool
        .request()
        .input("ID_Receta", sql.Int, receta.ID_Receta)
        .query(querys.getIngredientes);
      recetaDetails.ingredientes = resultIngredientes.recordset;
      console.log(recetaDetails.ingredientes);

      // Obtener clasificaciones de la receta
      const resultClasificaciones = await pool
        .request()
        .input("ID_Receta", sql.Int, receta.ID_Receta)
        .query(querys.getClasificaReceta);
      recetaDetails.clasificaciones = resultClasificaciones.recordset.map(
        (c) => c.clasificacion
      );
      console.log(recetaDetails.clasificaciones);

      // Obtener macronutrientes de la receta
      const resultMacronutrientes = await pool
        .request()
        .input("ID_Receta", sql.Int, receta.ID_Receta)
        .query(querys.getObtiene);
      recetaDetails.macronutrientes = resultMacronutrientes.recordset;
      console.log(recetaDetails.macronutrientes);

      recetas.push(recetaDetails);
    }

    res.json(recetas);
  } catch (error) {
    console.error("Error al obtener todas las recetas:", error);
    res.status(500).json({ error: "Error al obtener todas las recetas" });
  }
};

export const getRecetaRequests = async (req, res) => {
  try {
    const pool = await getConnection();
    let recetas = [];

    // Obtener todas las recetas básicas
    const resultRecetas = await pool.request().query(querys.getRecetaRequests);
    console.log(resultRecetas.recordset);
    const recetasBasics = resultRecetas.recordset;

    for (const receta of recetasBasics) {
      let recetaDetails = { ...receta };

      // Obtener ingredientes de la receta
      console.log(receta.ID_Receta);
      const resultIngredientes = await pool
        .request()
        .input("ID_Receta", sql.Int, receta.ID_Receta)
        .query(querys.getIngredientes);
      recetaDetails.ingredientes = resultIngredientes.recordset;
      console.log(recetaDetails.ingredientes);

      // Obtener clasificaciones de la receta
      const resultClasificaciones = await pool
        .request()
        .input("ID_Receta", sql.Int, receta.ID_Receta)
        .query(querys.getClasificaReceta);
      recetaDetails.clasificaciones = resultClasificaciones.recordset.map(
        (c) => c.clasificacion
      );
      console.log(recetaDetails.clasificaciones);

      // Obtener macronutrientes de la receta
      const resultMacronutrientes = await pool
        .request()
        .input("ID_Receta", sql.Int, receta.ID_Receta)
        .query(querys.getObtiene);
      recetaDetails.macronutrientes = resultMacronutrientes.recordset;
      console.log(recetaDetails.macronutrientes);

      recetas.push(recetaDetails);
    }

    res.json(recetas);
  } catch (error) {
    console.error("Error al obtener todas las recetas:", error);
    res.status(500).json({ error: "Error al obtener todas las recetas" });
  }
};

export const updateReceta = async (req, res) => {
  const { ID_Receta, receta, calorias, preparacion, link, ingredientes } =
    req.body;

  try {
    const pool = await getConnection();

    let caloriasTotales = 0;

    // Calcular las calorías totales de la receta
    for (const { ID_Alimento, porcion } of ingredientes) {
      const result = await pool.request()
        .input('ID_Alimento', sql.Int, ID_Alimento)
        .query(querys.getAlimentoById); // Asegúrate de tener esta consulta SQL

      const caloriasPorGramo = result.recordset[0].calorias / result.recordset[0].peso;
      caloriasTotales += caloriasPorGramo * porcion;
    }

    // Actualizar detalles de la receta
    await pool
      .request()
      .input("ID_Receta", sql.Int, ID_Receta)
      .input("receta", sql.NVarChar, receta)
      .input("calorias", sql.Int, caloriasTotales)
      .input("preparacion", sql.NVarChar, preparacion)
      .input("link", sql.NVarChar, link)
      .query(querys.updateReceta);

    // Eliminar ingredientes actuales
    await pool
      .request()
      .input("ID_Receta", sql.Int, ID_Receta)
      .query(querys.deleteIngredientesByReceta);
      
    let totalesMacronutrientes = {
      1: 0, // Grasas
      2: 0, // Carbohidratos
      3: 0, // Proteínas
    };

    console.log(ingredientes);
    // Insertar nuevos ingredientes
    for (const { ID_Alimento, porcion } of ingredientes) {
      await pool
        .request()
        .input("ID_Receta", sql.Int, ID_Receta)
        .input("ID_Alimento", sql.Int, ID_Alimento)
        .input("porcion", sql.Float, porcion)
        .query(querys.createTieneIngredientes);

        // Obtener macronutrientes del ingrediente
      const macronutrientesResult = await pool
      .request()
      .input("ID_Alimento", sql.Int, ID_Alimento)
      .query(querys.getContieneById);
       console.log(macronutrientesResult.recordset);

    // Calcular totales
    macronutrientesResult.recordset.forEach(
      ({ ID_Macronutriente, cantidad }) => {
        totalesMacronutrientes[ID_Macronutriente] +=
          cantidad * (porcion / 100); // Asumiendo que la cantidad está por cada 100g
        console.log(totalesMacronutrientes);
      }
    );
    }
    
    for (const { ID_Alimento, porcion } of ingredientes) {
      const macronutrientesResult = await pool
        .request()
        .input("ID_Alimento", sql.Int, ID_Alimento)
        .query(querys.getContieneById);
    
      macronutrientesResult.recordset.forEach(({ ID_Macronutriente, cantidad }) => {
        totalesMacronutrientes[ID_Macronutriente] += cantidad * (porcion / 100);
      });
    }
    
    // Eliminar clasificaciones y macronutrientes actuales
    await pool.request()
      .input("ID_Receta", sql.Int, ID_Receta)
      .query(querys.deleteClasificaReceta);
    
    await pool.request()
      .input("ID_Receta", sql.Int, ID_Receta)
      .query(querys.deleteObtieneByReceta);
    
    // Insertar nuevos totales de macronutrientes
    for (const ID_Macronutriente in totalesMacronutrientes) {
      await pool
        .request()
        .input("ID_Receta", sql.Int, ID_Receta)
        .input("ID_Macronutriente", sql.Int, ID_Macronutriente)
        .input("cantidad", sql.Float, totalesMacronutrientes[ID_Macronutriente])
        .query(querys.createObtiene);
    }
    
    let totalGramos = totalesMacronutrientes[1] + totalesMacronutrientes[2] + totalesMacronutrientes[3];

    // Calcular el porcentaje de cada macronutriente
    let porcentajeProteinas = (totalesMacronutrientes[3] / totalGramos) * 100;
    let porcentajeCarbohidratos = (totalesMacronutrientes[2] / totalGramos) * 100;
    let porcentajeGrasas = (totalesMacronutrientes[1] / totalGramos) * 100;
    console.log(porcentajeProteinas);
    console.log(porcentajeCarbohidratos);
    console.log(porcentajeGrasas);

  //   const porcentajeProteinas =
  //   ((totalesMacronutrientes[3] * 4) / calorias) * 100;
  // const porcentajeCarbohidratos =
  //   ((totalesMacronutrientes[2] * 4) / calorias) * 100;
  // const porcentajeGrasas = ((totalesMacronutrientes[1] * 9) / calorias) * 100;

  let ID_ClasificacionProteinas = 0; // ID de clasificación inicial
  let ID_ClasificacionCarbohidratos = 0; // ID de clasificación inicial
  let ID_ClasificacionGrasas = 0; // ID de clasificación inicial

  // Clasificación basada en proteínas
  if (porcentajeProteinas > 25) {
    ID_ClasificacionProteinas = 1; // Alto en proteínas
  } else if (porcentajeProteinas >= 15 && porcentajeProteinas <= 25) {
    ID_ClasificacionProteinas = 2; // Medio en proteínas
  } else {
    ID_ClasificacionProteinas = 3; // Bajo en proteínas
  }

  // Clasificación basada en carbohidratos
  if (porcentajeCarbohidratos > 55) {
    ID_ClasificacionCarbohidratos = 7; // Alto en carbohidratos
  } else if (porcentajeCarbohidratos >= 40 && porcentajeCarbohidratos <= 55) {
    ID_ClasificacionCarbohidratos = 8; // Medio en carbohidratos
  } else if (porcentajeCarbohidratos < 40) {
    ID_ClasificacionCarbohidratos = 9; // Bajo en carbohidratos
  }

  // Clasificación basada en grasas
  if (porcentajeGrasas > 40) {
    ID_ClasificacionGrasas = 4; // Alto en grasas
  } else if (porcentajeGrasas >= 30 && porcentajeGrasas <= 40) {
    ID_ClasificacionGrasas = 5; // Medio en grasas
  } else {
    ID_ClasificacionGrasas = 6; // Bajo en grasas
  }

   // Insertar clasificación de la receta
   await pool
   .request()
   .input("ID_Receta", sql.Int, ID_Receta)
   .input("ID_Clasificacion", sql.Int, ID_ClasificacionProteinas)
   .query(querys.createClasificaReceta);
   console.log(ID_ClasificacionProteinas);
 // Insertar clasificación de la receta
 await pool
   .request()
   .input("ID_Receta", sql.Int, ID_Receta)
   .input("ID_Clasificacion", sql.Int, ID_ClasificacionGrasas)
   .query(querys.createClasificaReceta);
   console.log(ID_ClasificacionGrasas);

 // Insertar clasificación de la receta
 await pool
   .request()
   .input("ID_Receta", sql.Int, ID_Receta)
   .input("ID_Clasificacion", sql.Int, ID_ClasificacionCarbohidratos)
   .query(querys.createClasificaReceta);
    console.log(ID_ClasificacionCarbohidratos);
    res.status(201).json({ message: "Receta agregada con éxito" });

  } catch (error) {
    console.error("Error al actualizar la receta:", error);
    res.status(500).json({ error: "Error al actualizar la receta" });
  }
};

export const updateAndAcceptReceta = async (req, res) => {
  const { ID_Receta, receta, calorias, preparacion, link, ingredientes } =
    req.body;

  try {
    const pool = await getConnection();

    let caloriasTotales = 0;

    // Calcular las calorías totales de la receta
    for (const { ID_Alimento, porcion } of ingredientes) {
      const result = await pool.request()
        .input('ID_Alimento', sql.Int, ID_Alimento)
        .query(querys.getAlimentoById); // Asegúrate de tener esta consulta SQL

      const caloriasPorGramo = result.recordset[0].calorias / result.recordset[0].peso;
      caloriasTotales += caloriasPorGramo * porcion;
    }

    // Actualizar detalles de la receta
    await pool
      .request()
      .input("ID_Receta", sql.Int, ID_Receta)
      .input("receta", sql.NVarChar, receta)
      .input("calorias", sql.Int, caloriasTotales)
      .input("preparacion", sql.NVarChar, preparacion)
      .input("link", sql.NVarChar, link)
      .query(querys.updateAndAcceptReceta);

    // Eliminar ingredientes actuales
    await pool
      .request()
      .input("ID_Receta", sql.Int, ID_Receta)
      .query(querys.deleteIngredientesByReceta);
      
    let totalesMacronutrientes = {
      1: 0, // Grasas
      2: 0, // Carbohidratos
      3: 0, // Proteínas
    };

    console.log(ingredientes);
    // Insertar nuevos ingredientes
    for (const { ID_Alimento, porcion } of ingredientes) {
      await pool
        .request()
        .input("ID_Receta", sql.Int, ID_Receta)
        .input("ID_Alimento", sql.Int, ID_Alimento)
        .input("porcion", sql.Float, porcion)
        .query(querys.createTieneIngredientes);

        // Obtener macronutrientes del ingrediente
      const macronutrientesResult = await pool
      .request()
      .input("ID_Alimento", sql.Int, ID_Alimento)
      .query(querys.getContieneById);
       console.log(macronutrientesResult.recordset);

    // Calcular totales
    macronutrientesResult.recordset.forEach(
      ({ ID_Macronutriente, cantidad }) => {
        totalesMacronutrientes[ID_Macronutriente] +=
          cantidad * (porcion / 100); // Asumiendo que la cantidad está por cada 100g
        console.log(totalesMacronutrientes);
      }
    );
    }
    
    for (const { ID_Alimento, porcion } of ingredientes) {
      const macronutrientesResult = await pool
        .request()
        .input("ID_Alimento", sql.Int, ID_Alimento)
        .query(querys.getContieneById);
    
      macronutrientesResult.recordset.forEach(({ ID_Macronutriente, cantidad }) => {
        totalesMacronutrientes[ID_Macronutriente] += cantidad * (porcion / 100);
      });
    }
    
    // Eliminar clasificaciones y macronutrientes actuales
    await pool.request()
      .input("ID_Receta", sql.Int, ID_Receta)
      .query(querys.deleteClasificaReceta);
    
    await pool.request()
      .input("ID_Receta", sql.Int, ID_Receta)
      .query(querys.deleteObtieneByReceta);
    
    // Insertar nuevos totales de macronutrientes
    for (const ID_Macronutriente in totalesMacronutrientes) {
      await pool
        .request()
        .input("ID_Receta", sql.Int, ID_Receta)
        .input("ID_Macronutriente", sql.Int, ID_Macronutriente)
        .input("cantidad", sql.Float, totalesMacronutrientes[ID_Macronutriente])
        .query(querys.createObtiene);
    }
    
    let totalGramos = totalesMacronutrientes[1] + totalesMacronutrientes[2] + totalesMacronutrientes[3];

    // Calcular el porcentaje de cada macronutriente
    let porcentajeProteinas = (totalesMacronutrientes[3] / totalGramos) * 100;
    let porcentajeCarbohidratos = (totalesMacronutrientes[2] / totalGramos) * 100;
    let porcentajeGrasas = (totalesMacronutrientes[1] / totalGramos) * 100;
    console.log(porcentajeProteinas);
    console.log(porcentajeCarbohidratos);
    console.log(porcentajeGrasas);

  //   const porcentajeProteinas =
  //   ((totalesMacronutrientes[3] * 4) / calorias) * 100;
  // const porcentajeCarbohidratos =
  //   ((totalesMacronutrientes[2] * 4) / calorias) * 100;
  // const porcentajeGrasas = ((totalesMacronutrientes[1] * 9) / calorias) * 100;

  let ID_ClasificacionProteinas = 0; // ID de clasificación inicial
  let ID_ClasificacionCarbohidratos = 0; // ID de clasificación inicial
  let ID_ClasificacionGrasas = 0; // ID de clasificación inicial

  // Clasificación basada en proteínas
  if (porcentajeProteinas > 25) {
    ID_ClasificacionProteinas = 1; // Alto en proteínas
  } else if (porcentajeProteinas >= 15 && porcentajeProteinas <= 25) {
    ID_ClasificacionProteinas = 2; // Medio en proteínas
  } else {
    ID_ClasificacionProteinas = 3; // Bajo en proteínas
  }

  // Clasificación basada en carbohidratos
  if (porcentajeCarbohidratos > 55) {
    ID_ClasificacionCarbohidratos = 7; // Alto en carbohidratos
  } else if (porcentajeCarbohidratos >= 40 && porcentajeCarbohidratos <= 55) {
    ID_ClasificacionCarbohidratos = 8; // Medio en carbohidratos
  } else if (porcentajeCarbohidratos < 40) {
    ID_ClasificacionCarbohidratos = 9; // Bajo en carbohidratos
  }

  // Clasificación basada en grasas
  if (porcentajeGrasas > 40) {
    ID_ClasificacionGrasas = 4; // Alto en grasas
  } else if (porcentajeGrasas >= 30 && porcentajeGrasas <= 40) {
    ID_ClasificacionGrasas = 5; // Medio en grasas
  } else {
    ID_ClasificacionGrasas = 6; // Bajo en grasas
  }

   // Insertar clasificación de la receta
   await pool
   .request()
   .input("ID_Receta", sql.Int, ID_Receta)
   .input("ID_Clasificacion", sql.Int, ID_ClasificacionProteinas)
   .query(querys.createClasificaReceta);
   console.log(ID_ClasificacionProteinas);
 // Insertar clasificación de la receta
 await pool
   .request()
   .input("ID_Receta", sql.Int, ID_Receta)
   .input("ID_Clasificacion", sql.Int, ID_ClasificacionGrasas)
   .query(querys.createClasificaReceta);
   console.log(ID_ClasificacionGrasas);

 // Insertar clasificación de la receta
 await pool
   .request()
   .input("ID_Receta", sql.Int, ID_Receta)
   .input("ID_Clasificacion", sql.Int, ID_ClasificacionCarbohidratos)
   .query(querys.createClasificaReceta);
    console.log(ID_ClasificacionCarbohidratos);
    res.status(201).json({ message: "Receta agregada con éxito" });

  } catch (error) {
    console.error("Error al actualizar la receta:", error);
    res.status(500).json({ error: "Error al actualizar la receta" });
  }
};

export const getIngredientes = async (req, res) => {
  const ID_Receta = req.params.id; // Obtiene el ID de la receta de los parámetros de la ruta

  try {
      const pool = await getConnection();
      const result = await pool.request()
          .input('ID_Receta', sql.Int, ID_Receta) // Establece el ID de la receta para la consulta
          .query(querys.getIngredientesById); // Ejecuta la consulta para obtener los ingredientes

      // Si todo sale bien, envía los ingredientes como respuesta
      res.json(result.recordset);
  } catch (error) {
      console.error("Error al obtener los ingredientes de la receta:", error);
      res.status(500).json({ error: "Error al obtener los ingredientes de la receta" });
  }
};

export const updateEstadoReceta = async (req, res) => {
  try {
    const  ID_Receta  = req.params.id; 
    const pool = await getConnection();

    await pool.request()
      .input('ID_Receta', sql.Int, ID_Receta)
      .query(querys.updateEstadoReceta);

    res.json({ message: "Estado del ejercicio actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el estado del ejercicio:", error);
    res.status(500).json({ error: error.message });
  }
}; 

export const deleteReceta = async (req, res) => {
  try {
      const id = req.params.id; // Obtén el ID de la receta de los parámetros de la URL
      const pool = await getConnection();

      // Ejecuta la consulta de borrado con el ID de la receta
      await pool.request()
          .input('ID_Receta', sql.Int, id)
          .query(querys.deleteReceta);

      // Si la receta se borró exitosamente, envía una respuesta afirmativa
      res.json({ message: "Receta borrada correctamente" });
  } catch (error) {
      console.error("Error al borrar la receta:", error);
      res.status(500).json({ error: "Error al borrar la receta" });
  }
};
