import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";
export const getUsers = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(querys.getUsers); 

    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const createUser = async (req, res) => {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { oid, name, givenName, surname, email, dateOfBirth, gender } =
      req.body;

    console.log("Datos del cuerpo de la solicitud:", req.body); // Registra los datos recibidos

    // Realizar la conexión a la base de datos
    const pool = await getConnection();

    console.log("Conexión a la base de datos exitosa"); // Registro de conexión exitosa

    // Consulta SQL para insertar un nuevo usuario
    const result = await pool
      .request()
      .input("oid", sql.VarChar, oid)
      .input("username", sql.NVarChar, name)
      .input("givenName", sql.NVarChar, givenName)
      .input("surname", sql.NVarChar, surname)
      .input("email", sql.NVarChar, email)
      .input("gender", sql.Char, gender)
      .input("dateOfBirth", sql.Date, new Date(dateOfBirth))
      .query(querys.createUser);

    console.log("Resultado de la inserción:", result); // Registra el resultado de la inserción

    if (result.rowsAffected.length > 0) {
      const userMovilResult = await pool
        .request()
        .input("ID_Usuario", sql.VarChar, oid) // ID_Usuario relacionado en UsuarioMovil
        .query(querys.createMovileUser);
      if (userMovilResult.rowsAffected.length > 0) {
        return res
          .status(201)
          .json({ message: "Usuario y UsuarioMovil creados correctamente" });
      } else {
        return res.status(500).json({ error: "No se pudo crear UsuarioMovil" });
      }
    } else {
      return res.status(500).json({ error: "No se pudo crear el usuario" });
    }
  } catch (error) {
    console.error("Error en la creación de usuario:", error); // Registra cualquier error que ocurra
    return res.status(500).json({ error: error.message });
  }
};

export const checkIfUserExists = async (req, res) => {
  const id = req.params.oid;
  console.log("oid:", id);
  try {
    const pool = await getConnection();
    console.log("Consultando...");
    const result = await pool
      .request()
      .input("oid", sql.VarChar, id)
      .query(querys.checkUserExists);

    if (result.recordset.length > 0) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error("Error al verificar la existencia del usuario:", error);
    res.status(500).send("Error al verificar la existencia del usuario");
  }
};

export const getBirthDate = async (req, res) => {
  const id = req.params.oid;
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('ID_Usuario', sql.VarChar, id)
      .query(querys.getBirthDate);

    if (result.recordset.length > 0) {
      const { fecha_nacimiento, sexo } = result.recordset[0];
      res.json({ fechaNacimiento: fecha_nacimiento, sexo });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserAndType = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(querys.getUserAndType); 
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener el ejercicio con su tipo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getUserById = async (req, res) => {
  const oid = req.params.oid; // Obtén el oid del usuario desde los parámetros de la URL
  try {
    const pool = await getConnection(); // Asume que ya tienes una función para obtener la conexión a la BD

    
    const result = await pool.request()
      .input('ID_Usuario', sql.VarChar, oid) // Asegúrate de que el tipo de dato coincide con el de tu BD
      .query(querys.getUserById); // Utiliza la consulta que definiste anteriormente

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]); // Devuelve los datos del usuario
    } else {
      res.status(404).json({ message: "Usuario no encontrado" }); // Manejo de usuario no encontrado
    }
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).send("Error interno del servidor"); // Manejo de error de servidor
  }
};

export const updateComparacionRendimiento = async (req, res) => {
  const id = req.params.id;
  const comparacion = req.body.value;
  console.log("ID_Usuario:", id);
  console.log(comparacion);
  try {
    const pool = await getConnection();

    let result = await pool.request()
    .input('ID_Usuario', sql.VarChar, id)
    .query(`SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario`);
    const ID_UsuarioMovil = result.recordset[0]?.ID_UsuarioMovil;
    if (!ID_UsuarioMovil) {
        return res.status(404).json({ message: "Cliente no encontrado." });
    }

    console.log("ID_UsuarioMovil:", ID_UsuarioMovil);

    await pool.request()
      .input('ID_UsuarioMovil', sql.Int, ID_UsuarioMovil)
      .input('comparacion', sql.Bit, comparacion) // Asegúrate de que el tipo de dato coincide
      .query("UPDATE UsuarioMovil SET ComparacionRendimiento = @comparacion WHERE ID_UsuarioMovil = @ID_UsuarioMovil"); 
    res.json({ message: "Comparación de rendimiento actualizada correctamente" });
  } catch (error) {
    console.error('Error al actualizar la comparación de rendimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateViajeGimnasio = async (req, res) => {
  const id = req.params.id;
  console.log("ID_Usuario:", id);
  const viaje = req.body.value;
  try {
    const pool = await getConnection();

    let result = await pool.request()
    .input('ID_Usuario', sql.VarChar, id)
    .query(`SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario`);
    const ID_UsuarioMovil = result.recordset[0]?.ID_UsuarioMovil;
    if (!ID_UsuarioMovil) {
        return res.status(404).json({ message: "Cliente no encontrado." });
    }

    await pool.request()
      .input('ID_UsuarioMovil', sql.Int, ID_UsuarioMovil)
      .input('viaje', sql.Bit, viaje) // Asegúrate de que el tipo de dato coincide
      .query(querys.updateViajeGimnasio);

    res.json({ message: "Viaje al gimnasio actualizado correctamente" });
  } catch (error) {
    console.error('Error al actualizar el viaje al gimnasio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAllMobileUsersInfo = async (req, res) => {
  try {
    const pool = await getConnection();

    // Consulta para obtener la información de todos los usuarios móviles y su tipo
    const allUsersInfoResult = await pool.request().query(`
      SELECT 
        u.ID_Usuario, 
        u.nombre_usuario, 
        u.nombre, 
        u.apellido, 
        u.correo, 
        u.sexo, 
        u.fecha_nacimiento, 
        um.ID_Tipo, 
        um.ComparacionRendimiento, 
        um.ViajeGimnasio, 
        t.descripcion AS tipo_descripcion
      FROM 
        Usuario u
        INNER JOIN UsuarioMovil um ON u.ID_Usuario = um.ID_Usuario
        INNER JOIN Tipo t ON um.ID_Tipo = t.ID_Tipo
    `);

    // Verificar si se encontró información para los usuarios móviles
    if (allUsersInfoResult.recordset.length > 0) {
      const allUsersInfo = allUsersInfoResult.recordset;
      res.json(allUsersInfo); // Devolver la información de todos los usuarios móviles en formato JSON
    } else {
      res.status(404).json({ message: "No se encontraron usuarios móviles" }); // Manejo de usuarios no encontrados
    }
  } catch (error) {
    console.error('Error al obtener la información de los usuarios móviles:', error);
    res.status(500).json({ error: 'Error interno del servidor' }); // Manejo de error de servidor
  }
};



//obtener el tipo de usuario a partir del id
export const getMobileUserTypeByID = async (req, res) => {
  const oid = req.params.oid; 

  try {
    const pool = await getConnection();

    // Consulta para obtener la información de todos los usuarios móviles y su tipo
    const result = await pool.request()
    .input("oid", sql.VarChar, oid) 
    .query(`
      SELECT 
        u.ID_Usuario, 
        um.ID_Tipo, 
        t.descripcion AS tipo_descripcion
      FROM 
        Usuario u
      INNER JOIN UsuarioMovil um ON u.ID_Usuario = um.ID_Usuario
      INNER JOIN Tipo t ON um.ID_Tipo = t.ID_Tipo
      WHERE u.ID_Usuario = @oid
    `);

    // Verificar si se encontró información para los usuarios móviles
    if (result.recordset.length > 0) {
      res.json(result.recordset);
    } else {
      res.status(404).json({ message: "No se encontraron usuarios móviles" }); // Manejo de usuarios no encontrados
    }
  } catch (error) {
    console.error('Error al obtener la información de los usuarios móviles:', error);
    res.status(500).json({ error: 'Error interno del servidor' }); // Manejo de error de servidor
  }
};

export const checkPerformanceComparisonEnabled = async (req, res) => {
  const id = req.params.oid;  // Asume que el OID del usuario se pasa como parámetro en la URL

  try {
    const pool = await getConnection();

  // Realiza la consulta para obtener la configuración de comparación de rendimiento
    const result = await pool.request()
      .input('ID_Usuario', sql.VarChar, id)  // Asegúrate de que el ID de usuario está correctamente referenciado
      .query(`
        SELECT ComparacionRendimiento 
        FROM UsuarioMovil 
        WHERE ID_Usuario = @ID_Usuario
      `);

    // Verifica si se obtuvo algún resultado y responde adecuadamente
    if (result.recordset.length > 0) {
      const { ComparacionRendimiento } = result.recordset[0];
      res.json({ isEnabled: ComparacionRendimiento });  // Devuelve el estado de ComparacionRendimiento como booleano
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error('Error al verificar la configuración de comparación de rendimiento:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getWEBUserTypeByID = async (req, res) => {
  
  const oid = req.params.oid; 

  try {
    const pool = await getConnection();

    // Consulta para obtener la información de todos los usuarios móviles y su tipo
    const result = await pool.request()
    .input("oid", sql.VarChar, oid) 
    .query(`
      SELECT 
        u.ID_Usuario, 
        um.ID_Tipo_WEB, 
        t.tipo AS tipo_descripcion
      FROM 
        Usuario u
      INNER JOIN Usuario_WEB um ON u.ID_Usuario = um.ID_Usuario
      INNER JOIN Tipo_WEB t ON um.ID_Tipo_Web = t.ID_Tipo_Web
      WHERE u.ID_Usuario = @oid
    `);

    // Verificar si se encontró información para los usuarios móviles
    if (result.recordset.length > 0) {
      res.json(result.recordset);
    } else {
      res.status(404).json({ message: "No se encontraron usuarios móviles" }); // Manejo de usuarios no encontrados
    }
  } catch (error) {
    console.error('Error al obtener la información de los usuarios móviles:', error);
    res.status(500).json({ error: 'Error interno del servidor' }); // Manejo de error de servidor
  }
}
