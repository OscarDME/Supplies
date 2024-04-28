import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";

export const getDietasByID = async (req, res) => {
  try {
    const userId = req.params.id; // ID del usuario (id_usuario)
    
    // Establece conexión con la base de datos
    const pool = await getConnection();
    
    // Buscar el ID_UsuarioMovil correspondiente al ID_Usuario
    let result = await pool.request()
        .input('ID_Usuario', sql.VarChar, userId)
        .query('SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario');
    const usuarioMovilId = result.recordset[0]?.ID_UsuarioMovil;

    if (!usuarioMovilId) {
      return res.status(404).json({ message: 'Usuario móvil no encontrado.' });
    }

    // Ejecuta la consulta para obtener las dietas activas del usuario
    result = await pool.request()
        .input('ID_UsuarioMovil', sql.Int, usuarioMovilId)
        .query(`SELECT d.*, da.* FROM DietaAsignada da 
                JOIN Dieta d ON da.ID_Dieta = d.ID_Dieta 
                WHERE da.ID_UsuarioMovil = @ID_UsuarioMovil AND da.fecha_fin >= GETDATE()`);

    // Si no hay resultados, devuelve una respuesta indicando que no se encontraron dietas
    if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'No se encontraron dietas activas para el usuario.' });
    }

    // Devuelve las dietas encontradas
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener las dietas activas:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};


export const getTiemposComida= async (req, res) => {
    try {
    const pool = await getConnection();
    const result = await pool.request().query(querys.getTiemposComida);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los tiempos de comida:", error);
    res.status(500).json({ error: error.message });
  }
};


export const getAllAlimentosAndRecetas = async (req, res) => {
    try {
      const pool = await getConnection();
  
      // Obtener todos los alimentos con macronutrientes
      const alimentosResult = await pool.request().query(querys.getAlimento);
      const alimentos = alimentosResult.recordset;
  
      for (let alimento of alimentos) {
        const macronutrientesResult = await pool.request()
          .input('ID_Alimento', sql.Int, alimento.ID_Alimento)
          .query(querys.getContiene);
        alimento.macronutrientes = macronutrientesResult.recordset;
      }
  
      // Obtener todas las recetas con detalles
      const resultRecetas = await pool.request().query(querys.getReceta);
      const recetasBasics = resultRecetas.recordset;
      let recetas = [];
  
      for (const receta of recetasBasics) {
        let recetaDetails = { ...receta };
  
        const resultIngredientes = await pool
          .request()
          .input("ID_Receta", sql.Int, receta.ID_Receta)
          .query(querys.getIngredientes);
        recetaDetails.ingredientes = resultIngredientes.recordset;
  
        const resultClasificaciones = await pool
          .request()
          .input("ID_Receta", sql.Int, receta.ID_Receta)
          .query(querys.getClasificaReceta);
        recetaDetails.clasificaciones = resultClasificaciones.recordset.map(c => c.clasificacion);
  
        const resultMacronutrientes = await pool
          .request()
          .input("ID_Receta", sql.Int, receta.ID_Receta)
          .query(querys.getObtiene);
        recetaDetails.macronutrientes = resultMacronutrientes.recordset;
  
        recetas.push(recetaDetails);
      }
  
      // Combinar alimentos y recetas en un solo array
      const combinedItems = [
        ...alimentos.map(alimento => ({ type: 'Alimento', ...alimento })),
        ...recetas.map(receta => ({ type: 'Receta', ...receta }))
      ];
  
      res.json(combinedItems);
    } catch (error) {
      console.error("Error al obtener alimentos y recetas:", error);
      res.status(500).json({ error: error.message });
    }
  };

  
  // Dentro de tus controladores o servicios
   export const createAndAssignDiet = async (req, res) => {
   const { name, startDate, endDate, clientId, nutritionistId, days } = req.body;
    const dayOfWeekMapping = {
      'Lunes': 1,
      'Martes': 2,
      'Miércoles': 3,
      'Jueves': 4,
      'Viernes': 5,
      'Sábado': 6,
      'Domingo': 7
  };
  
    try {
        const pool = await getConnection();
        let result = await pool.request()
        .input('ID_Usuario', sql.VarChar, clientId)
        .query(`SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario`);
    const ID_UsuarioMovil = result.recordset[0]?.ID_UsuarioMovil;
    if (!ID_UsuarioMovil) {
        return res.status(404).json({ message: "Cliente no encontrado." });
    }

    // Buscar ID_Usuario_WEB basado en nutritionistId
    result = await pool.request()
        .input('ID_Usuario', sql.VarChar, nutritionistId)
        .query(`SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario`);
    const ID_Usuario_WEB = result.recordset[0]?.ID_Usuario_WEB;
    if (!ID_Usuario_WEB) {
        return res.status(404).json({ message: "Nutricionista no encontrado." });
    }
        // Insertar dieta y obtener ID
        let queryResult = await pool.request()
            .input('name', sql.VarChar(70), name)
            .query(`INSERT INTO Dieta (nombre) OUTPUT INSERTED.ID_Dieta VALUES (@name);`);
        const dietaId = queryResult.recordset[0].ID_Dieta;

        // Asignar dieta
        await pool.request()
            .input('ID_UsuarioMovil', sql.Int, ID_UsuarioMovil)
            .input('ID_Dieta', sql.Int, dietaId)
            .input('fecha_inicio', sql.Date, startDate)
            .input('fecha_fin', sql.Date, endDate)
            .input('ID_Usuario_WEB', sql.Int, ID_Usuario_WEB)
            .query(`INSERT INTO DietaAsignada (ID_UsuarioMovil, ID_Dieta, fecha_inicio, fecha_fin, ID_Usuario_WEB, fecha_Asignacion) 
                    VALUES (@ID_UsuarioMovil, @ID_Dieta, @fecha_inicio, @fecha_fin, @ID_Usuario_WEB, GETDATE());`);

        for (const day of days) {
            const dayId = dayOfWeekMapping[day.day]; // Asume que tienes un mapeo de nombres de día a IDs

            // Por cada día, insertar en DiasComida y obtener ID
            queryResult = await pool.request()
                .input('ID_Dia', sql.Int, dayId)
                .query(`INSERT INTO DiasComida (ID_Dia) OUTPUT INSERTED.ID_DiasComida VALUES (@ID_Dia);`);
            const diasComidaId = queryResult.recordset[0].ID_DiasComida;

             // Insertar en ComponeDieta
            await pool.request()
            .input('ID_Dieta', sql.Int, dietaId)
            .input('ID_DiasComida', sql.Int, diasComidaId)
            .query(`INSERT INTO ComponeDieta (ID_Dieta, ID_DiasComida) VALUES (@ID_Dieta, @ID_DiasComida);`);

            for (const meal of day.meals) {
                for (const food of meal.foods) {
                    const [type, id] = food.selectedFoodOrRecipeId.split('-');

                    if (type === 'A') {
                        // Insertar en ComponeDiasComidaAlimento
                        await pool.request()
                            .input('ID_DiasComida', sql.Int, diasComidaId)
                            .input('ID_Alimento', sql.Int, parseInt(id))
                            .input('ID_TiempoComida', sql.Int, meal.mealTimeId)
                            .input('porcion', sql.Int, food.portion)
                            .query(`INSERT INTO ComponeDiasComidaAlimento (ID_Alimento, ID_TiempoComida, ID_DiasComida, porcion) VALUES ( @ID_Alimento, @ID_TiempoComida, @ID_DiasComida, @porcion);`);
                    } else if (type === 'R') {
                        // Insertar en ComponeDiasComidaReceta
                        await pool.request()
                            .input('ID_DiasComida', sql.Int, diasComidaId)
                            .input('ID_Receta', sql.Int, parseInt(id))
                            .input('ID_TiempoComida', sql.Int, meal.mealTimeId)
                            .input('porcion', sql.Int, food.portion)
                            .query(`INSERT INTO ComponeDiasComidaReceta (ID_Receta, ID_TiempoComida, ID_DiasComida, porcion) VALUES ( @ID_Receta, @ID_TiempoComida, @ID_DiasComida, @porcion);`);
                    }
                }
            }
        }

        res.status(200).json({ message: 'Dieta creada y asignada con éxito, incluyendo días, comidas, alimentos y recetas.' });
    } catch (error) {
        console.error("Error al crear y asignar dieta:", error);
        res.status(500).json({ error: error.message });
    }
};



export const getCurrentOrUpcomingDiet = async (req, res) => {
  const userId = req.params.id; // Asume que el ID del usuario se obtiene de los parámetros de la solicitud
  const selectedDate = req.params.selectedDate; // Fecha seleccionada obtenida de los parámetros de la query

  console.log(selectedDate);
  const dayOfWeek = (new Date(selectedDate).getDay() + 6) % 7 + 1; // Convierte 0 (domingo) a 7, 1 (lunes) a 1, etc.

  try {
    const pool = await getConnection();
    
    // Obtener ID_UsuarioMovil
    let result = await pool.request()
      .input('ID_Usuario', sql.VarChar, userId)
      .query(`SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario`);
    const ID_UsuarioMovil = result.recordset[0]?.ID_UsuarioMovil;

    if (!ID_UsuarioMovil) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    // Obtener la dieta asignada actual o la próxima más cercana
    result = await pool.request()
      .input('ID_UsuarioMovil', sql.Int, ID_UsuarioMovil)
      .query(`
        SELECT TOP 1 da.*
        FROM DietaAsignada da
        WHERE da.ID_UsuarioMovil = @ID_UsuarioMovil AND da.fecha_fin >= CAST(GETDATE() AS Date)
        ORDER BY da.fecha_inicio ASC
      `);
    const dietaAsignada = result.recordset[0];

    if (!dietaAsignada) {
      return res.status(404).json({ message: 'No se encontraron dietas activas o próximas para el usuario.' });
    }

    // Obtener DiasComida relacionados con la DietaAsignada
    console.log(dietaAsignada.ID_Dieta);
    console.log(dayOfWeek);
    const resulta = await pool.request()
      .input('ID_Dieta', sql.Int, dietaAsignada.ID_Dieta)
      .input('DayOfWeek', sql.Int, dayOfWeek) // Asegúrate de que tu base de datos utiliza el mismo esquema de numeración de días
      .query(`
        SELECT dc.*
        FROM DiasComida dc
        INNER JOIN ComponeDieta cd ON dc.ID_DiasComida = cd.ID_DiasComida
        WHERE cd.ID_Dieta = @ID_Dieta AND dc.ID_Dia = @DayOfWeek
      `);
      const diasComida = resulta.recordset;
      console.log(diasComida);

    // Para cada DiaComida, obtener los alimentos y recetas
    for (const dia of diasComida) {
      const alimentosResult = await pool.request()
        .input('ID_DiasComida', sql.Int, dia.ID_DiasComida)
        .query(`
          SELECT a.*, cdca.porcion, cdca.ID_TiempoComida
          FROM ComponeDiasComidaAlimento cdca
          INNER JOIN Alimento a ON cdca.ID_Alimento = a.ID_Alimento
          WHERE cdca.ID_DiasComida = @ID_DiasComida
        `);
      dia.alimentos = alimentosResult.recordset;

      const recetasResult = await pool.request()
        .input('ID_DiasComida', sql.Int, dia.ID_DiasComida)
        .query(`
          SELECT r.*, cdcr.porcion, cdcr.ID_TiempoComida
          FROM ComponeDiasComidaReceta cdcr
          INNER JOIN Receta r ON cdcr.ID_Receta = r.ID_Receta
          WHERE cdcr.ID_DiasComida = @ID_DiasComida
        `);
      dia.recetas = recetasResult.recordset;
      console.log(dia.recetas)
    }

    // Devolver la dieta asignada y los detalles de los días de comida
    console.log(diasComida);
    res.json({
      dietaAsignada,
      diasComida
    });
  } catch (error) {
    console.error('Error al obtener la dieta actual o próxima:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const registrarCompletado = async (req, res) => {
  const { ID_Usuario, ID_DiasComida, ID_Alimento, ID_Receta, PorcionConsumida } = req.body;
  console.log(ID_Usuario);
  console.log(ID_DiasComida);
  console.log(ID_Alimento);
  console.log(ID_Receta);
  console.log(PorcionConsumida);

  try {
    const pool = await getConnection();

    let result = await pool.request()
    .input('ID_Usuario', sql.VarChar, ID_Usuario)
    .query(`SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario`);
    const ID_UsuarioMovil = result.recordset[0]?.ID_UsuarioMovil;    

    await pool.request()
      .input('ID_UsuarioMovil', sql.Int, ID_UsuarioMovil)
      .input('ID_DiasComida', sql.Int, ID_DiasComida)
      .input('ID_Alimento', sql.Int, ID_Alimento) // Puede ser null
      .input('ID_Receta', sql.Int, ID_Receta) // Puede ser null
      .input('PorcionConsumida', sql.Decimal(10,2), PorcionConsumida)
      .query(`INSERT INTO CompletadoDieta (ID_UsuarioMovil, ID_DiasComida, ID_Alimento, ID_Receta, FechaCompletado, PorcionConsumida, Completado) VALUES (@ID_UsuarioMovil, @ID_DiasComida, @ID_Alimento, @ID_Receta, GETDATE(), @PorcionConsumida, 1);`);

      res.status(200).json({ message: 'Dieta creada y asignada con éxito, incluyendo días, comidas, alimentos y recetas.' });
    } catch (error) {
    console.error('Error registrando completado:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

export const obtenerCompletadosPorFecha = async (req, res) => {
  const ID_Usuario = req.params.id; // ID del usuario (id_usuario)
  const Fecha = req.params.fecha; // Fecha de los completados a obtener

  try {
    const pool = await getConnection();
    let resu = await pool.request()
    .input('ID_Usuario', sql.VarChar, ID_Usuario)
    .query(`SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario`);
    const ID_UsuarioMovil = resu.recordset[0]?.ID_UsuarioMovil;  

    const result = await pool.request()
      .input('ID_UsuarioMovil', sql.Int, ID_UsuarioMovil)
      .input('Fecha', sql.Date, Fecha)
      .query(`SELECT * FROM CompletadoDieta WHERE ID_UsuarioMovil = @ID_UsuarioMovil AND FechaCompletado = @Fecha`);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error obteniendo completados por fecha:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

export const eliminarCompletado = async (req, res) => {
  const { ID_UsuarioMovil, ID_DiasComida, ID_Alimento, ID_Receta, FechaCompletado } = req.body;

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('ID_UsuarioMovil', sql.Int, ID_UsuarioMovil)
      .input('ID_DiasComida', sql.Int, ID_DiasComida)
      // Asume que tanto ID_Alimento como ID_Receta pueden ser nulos, ajusta según sea necesario
      .input('ID_Alimento', sql.Int, ID_Alimento)
      .input('ID_Receta', sql.Int, ID_Receta)
      .input('FechaCompletado', sql.Date, FechaCompletado)
      .query(`DELETE FROM CompletadoDieta WHERE ID_UsuarioMovil = @ID_UsuarioMovil AND ID_DiasComida = @ID_DiasComida AND (ID_Alimento = @ID_Alimento OR ID_Receta = @ID_Receta) AND FechaCompletado = @FechaCompletado;`);

    if (result.rowsAffected[0] > 0) {
      res.json({ message: 'Ítem de dieta desmarcado como completado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Ítem de dieta no encontrado o ya eliminado.' });
    }
  } catch (error) {
    console.error('Error al eliminar ítem completado:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};





