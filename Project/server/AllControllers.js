import { getConnection } from "./Database/connection.js";
import { sql } from "./Database/connection.js";
import { querys } from "./Database/querys.js";

export const verifyAndInsertUser = async (req, res) => {
    try {
      // Obtener los datos del cuerpo de la solicitud
      const { ID_Usuario, Nombre_Usuario } = req.body;
  
      console.log("Datos del cuerpo de la solicitud:", req.body); // Registra los datos recibidos
  
      // Realizar la conexión a la base de datos
      const pool = await getConnection();
      console.log("Conexión a la base de datos exitosa"); // Registro de conexión exitosa
  
      // Consulta SQL para verificar si el usuario ya existe
      const userExistenceResult = await pool
        .request()
        .input('ID_Usuario', sql.VarChar, ID_Usuario)
        .input('Nombre_Usuario', sql.VarChar, Nombre_Usuario)
        .query(querys.checkUserExistence);
  
      if (userExistenceResult.recordset.length === 0) {
        // Si el usuario no existe, insertarlo
        const insertResult = await pool
          .request()
          .input('ID_Usuario', sql.VarChar, ID_Usuario)
          .input('Nombre_Usuario', sql.VarChar, Nombre_Usuario)
          .query(querys.insertUser);
  
        if (insertResult.rowsAffected[0] > 0) {
          console.log("Usuario insertado correctamente", insertResult);
          // Crear un carrito para el usuario recién insertado
          const createCartResult = await pool
            .request()
            .input('ID_Usuario', sql.VarChar, ID_Usuario)
            .query(querys.createCartForUser);
  
          if (createCartResult.rowsAffected[0] > 0) {
            console.log("Carrito creado correctamente");
            return res.status(201).json({ message: "Usuario y carrito creados correctamente" });
          } else {
            console.error("Error al crear el carrito del usuario");
            return res.status(500).json({ error: "No se pudo crear el carrito del usuario" });
          }
        } else {
          console.error("Error al insertar el usuario");
          return res.status(500).json({ error: "No se pudo insertar el usuario" });
        }
      } else {
        console.log("El usuario ya existe");
        return res.status(409).json({ message: "El usuario ya existe" });
      }
    } catch (error) {
      console.error("Error al verificar o insertar el usuario y crear el carrito:", error); // Registra cualquier error que ocurra
      return res.status(500).json({ error: error.message });
    }
  };

  
export const getAllProducts = async (req, res) => {
    try {
        // Realizar la conexión a la base de datos
        const pool = await getConnection();
        console.log("Conexión a la base de datos exitosa para obtener productos");

        // Consulta SQL para obtener todos los productos y su tipo
        const result = await pool.request().query(querys.getAllProducts);

        // Verificar si se obtuvieron resultados
        if (result.recordset.length > 0) {
            console.log("Productos obtenidos correctamente", result.recordset);
            return res.status(200).json(result.recordset);
        } else {
            console.log("No se encontraron productos");
            return res.status(404).json({ message: "No se encontraron productos" });
        }
    } catch (error) {
        console.error("Error al obtener productos:", error); // Registra cualquier error que ocurra
        return res.status(500).json({ error: error.message });
    }
};

export const removeProductFromCart = async (req, res) => {
    try {
        const { ID_Usuario, ID_Producto } = req.body;
        console.log("Datos del cuerpo de la solicitud:", req.body);
        const pool = await getConnection();
        const result = await pool.request()
            .input('ID_Usuario', sql.VarChar, ID_Usuario)
            .input('ID_Producto', sql.Int, ID_Producto)
            .query(querys.removeProductFromCart);

        if (result.rowsAffected[0] > 0) {
            return res.status(200).json({ message: "Producto eliminado del carrito correctamente" });
        } else {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        return res.status(500).json({ error: error.message });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const { ID_Usuario, ID_Producto } = req.body;
        console.log("ID_Usuario:", ID_Usuario);
        console.log("Datos del cuerpo de la solicitud:", req.body); // Registra los datos recibidos
        const pool = await getConnection();
        const result = await pool.request()
            .input('ID_Usuario', sql.VarChar, ID_Usuario)
            .input('ID_Producto', sql.Int, ID_Producto)
            .query(querys.addProductToCart);

        if (result.rowsAffected[0] > 0) {
            return res.status(201).json({ message: "Producto agregado al carrito correctamente" });
        } else {
            return res.status(400).json({ message: "No se pudo agregar el producto al carrito" });
        }
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        return res.status(500).json({ error: error.message });
    }
};


export const getCartProducts = async (req, res) => {
    try {
        const ID_Usuario = req.params.id; // Asegúrate de que el ID del usuario es pasado correctamente
        const pool = await getConnection();
        const result = await pool.request()
            .input('ID_Usuario', sql.VarChar, ID_Usuario)
            .query(querys.getCartProducts);

        if (result.recordset.length > 0) {
            console.log("Productos del carrito obtenidos correctamente", result.recordset);
            return res.status(200).json(result.recordset);
        } else {
            console.log("No se encontraron productos en el carrito");
            return res.status(404).json({ message: "No se encontraron productos en el carrito" });
        }
    } catch (error) {
        console.error("Error al obtener productos del carrito:", error);
        return res.status(500).json({ error: error.message });
    }
};

export const updateProductQuantity = async (req, res) => {
  try {
      const { ID_Usuario, ID_Producto, Cantidad } = req.body;

      const pool = await getConnection();
      const result = await pool.request()
          .input('ID_Usuario', sql.VarChar, ID_Usuario)
          .input('ID_Producto', sql.Int, ID_Producto)
          .input('Cantidad', sql.Int, Cantidad)
          .query(querys.updateProductQuantityInCart);

      if (result.rowsAffected[0] > 0) {
          return res.status(200).json({ message: "Cantidad actualizada correctamente" });
      } else {
          return res.status(404).json({ message: "Producto no encontrado en el carrito" });
      }
  } catch (error) {
      console.error("Error al actualizar la cantidad del producto en el carrito:", error);
      return res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
      const { ID_Usuario, Total, MetodoPago, DireccionEnvio, NombreReceptor, ApellidoReceptor, productos } = req.body;
      const pool = await getConnection();

      // Crear la orden
      const result = await pool.request()
          .input('ID_Usuario', sql.VarChar, ID_Usuario)
          .input('Total', sql.Decimal(10, 2), Total)
          .input('MetodoPago', sql.VarChar, MetodoPago)
          .input('DireccionEnvio', sql.NVarChar, DireccionEnvio)
          .input('NombreReceptor', sql.NVarChar, NombreReceptor)
          .input('ApellidoReceptor', sql.NVarChar, ApellidoReceptor)
          .query(querys.createOrder);

      if (result.recordset.length > 0) {
          const ID_Pedido = result.recordset[0].ID_Pedido;

          // Añadir cada producto al pedido
          for (const producto of productos) {
              await pool.request()
                  .input('ID_Pedido', sql.Int, ID_Pedido)
                  .input('ID_Producto', sql.Int, producto.ID_Producto)
                  .input('Cantidad', sql.Int, producto.Cantidad)
                  .input('PrecioUnitario', sql.Decimal(10, 2), producto.PrecioUnitario)
                  .query(querys.addProductToOrder);
          }

          return res.status(201).json({ message: "Pedido creado y productos añadidos correctamente", ID_Pedido: ID_Pedido });
      } else {
          return res.status(400).json({ message: "No se pudo crear el pedido" });
      }
  } catch (error) {
      console.error("Error al crear el pedido y añadir productos:", error);
      return res.status(500).json({ error: error.message });
  }
};

export const addProductToOrder = async (req, res) => {
  try {
      const { ID_Pedido, ID_Producto, Cantidad, PrecioUnitario } = req.body;
      const pool = await getConnection();
      const result = await pool.request()
          .input('ID_Pedido', sql.Int, ID_Pedido)
          .input('ID_Producto', sql.Int, ID_Producto)
          .input('Cantidad', sql.Int, Cantidad)
          .input('PrecioUnitario', sql.Decimal(10, 2), PrecioUnitario)
          .query(querys.addProductToOrder);

      if (result.rowsAffected[0] > 0) {
          return res.status(200).json({ message: "Producto agregado al pedido correctamente" });
      } else {
          return res.status(404).json({ message: "No se pudo agregar el producto al pedido" });
      }
  } catch (error) {
      console.error("Error al agregar producto al pedido:", error);
      return res.status(500).json({ error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
      const { ID_Pedido } = req.body;
      const pool = await getConnection();
      const result = await pool.request()
          .input('ID_Pedido', sql.Int, ID_Pedido)
          .query(querys.cancelOrder);

      if (result.rowsAffected[0] > 0) {
          return res.status(200).json({ message: "Pedido cancelado correctamente" });
      } else {
          return res.status(404).json({ message: "Pedido no encontrado" });
      }
  } catch (error) {
      console.error("Error al cancelar el pedido:", error);
      return res.status(500).json({ error: error.message });
  }
};

export const getPedidosByUser = async (req, res) => {
  try {
      const  ID_Usuario  = req.params.id;  // Obtener el ID del usuario de los parámetros del request
      const pool = await getConnection();
      const result = await pool.request()
          .input('ID_Usuario', sql.VarChar, ID_Usuario)
          .query(querys.getPedidosByUser);

      if (result.recordset.length > 0) {
          return res.status(200).json(result.recordset);
      } else {
          return res.status(404).json({ message: "No se encontraron pedidos para el usuario especificado" });
      }
  } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      return res.status(500).json({ error: error.message });
  }
};

export const addProduct = async (req, res) => {
    try {
      // Obtener los datos del cuerpo de la solicitud
      const { Producto, ID_Tipo, Descripcion, Precio, Stock } = req.body;
  
      console.log("Datos del cuerpo de la solicitud:", req.body);
  
      // Realizar la conexión a la base de datos
      const pool = await getConnection();
      console.log("Conexión a la base de datos exitosa");
  
      // Insertar el nuevo producto
      const insertResult = await pool
        .request()
        .input('Producto', sql.VarChar, Producto)
        .input('ID_Tipo', sql.Int, ID_Tipo)
        .input('Descripcion', sql.VarChar, Descripcion)
        .input('Precio', sql.Decimal(10, 2), Precio)
        .input('Stock', sql.Bit, Stock)
        .query(querys.addProduct);
  
      if (insertResult.rowsAffected[0] > 0) {
        console.log("Producto agregado correctamente", insertResult);
        return res.status(201).json({ message: "Producto agregado correctamente" });
      } else {
        console.error("Error al agregar el producto");
        return res.status(500).json({ error: "No se pudo agregar el producto" });
      }
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      return res.status(500).json({ error: error.message });
    }
  };

  export const getProducts = async (req, res) => {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(querys.getAllProducts2);
  
      if (result.recordset.length > 0) {
        console.log("Productos obtenidos correctamente", result.recordset);
        return res.status(200).json(result.recordset);
      } else {
        console.log("No se encontraron productos");
        return res.status(404).json({ message: "No se encontraron productos" });
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      return res.status(500).json({ error: error.message });
    }
  };

  export const updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { Producto, Precio, Cantidad } = req.body;
  
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('ID_Producto', sql.Int, id)
        .input('Producto', sql.VarChar, Producto)
        .input('Precio', sql.Decimal(10, 2), Precio)
        .input('Cantidad', sql.Int, Cantidad)
        .query(querys.updateProduct);
  
      if (result.rowsAffected[0] > 0) {
        return res.status(200).json({ message: 'Producto actualizado correctamente' });
      } else {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      return res.status(500).json({ error: error.message });
    }
  };

  export const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('ID_Producto', sql.Int, id)
        .query(querys.deleteProduct);
  
      if (result.rowsAffected[0] > 0) {
        return res.status(200).json({ message: 'Producto eliminado correctamente' });
      } else {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      return res.status(500).json({ error: error.message });
    }
  };