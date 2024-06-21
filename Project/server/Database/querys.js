export const querys = {
    checkUserExistence: "SELECT ID_Usuario FROM Usuario WHERE ID_Usuario = @ID_Usuario OR Nombre_Usuario = @Nombre_Usuario",
    insertUser: "INSERT INTO Usuario (ID_Usuario, Nombre_Usuario, ID_TipoUsuario) VALUES (@ID_Usuario, @Nombre_Usuario, 1)",
    getAllProducts: "SELECT p.ID_Producto, p.Producto, p.Descripcion, p.Precio, p.ID_Tipo, p.Stock, p.Cantidad, t.Tipo FROM Producto p LEFT JOIN Tipo t ON p.ID_Tipo = t.ID_Tipo",
    getAllProducts2: "SELECT * FROM Producto",
    createCartForUser: "INSERT INTO Carrito (ID_Usuario) VALUES (@ID_Usuario)",
    addProductToCart: `
        INSERT INTO ProductosCarrito (ID_Carrito, ID_Producto, Cantidad)
        SELECT c.ID_Carrito, @ID_Producto, 1
        FROM Carrito c
        WHERE c.ID_Usuario = @ID_Usuario
    `,
    removeProductFromCart: `
        DELETE pc
        FROM ProductosCarrito pc
        JOIN Carrito c ON pc.ID_Carrito = c.ID_Carrito
        WHERE c.ID_Usuario = @ID_Usuario AND pc.ID_Producto = @ID_Producto
    `,
    getCartProducts: `
        SELECT p.ID_Producto, p.Producto, p.Descripcion, p.Precio, p.Cantidad AS CantidadDisponible, t.Tipo, pc.Cantidad
        FROM ProductosCarrito pc
        JOIN Carrito c ON pc.ID_Carrito = c.ID_Carrito
        JOIN Producto p ON pc.ID_Producto = p.ID_Producto
        JOIN Tipo t ON p.ID_Tipo = t.ID_Tipo
        WHERE c.ID_Usuario = @ID_Usuario
    `,
    updateProductQuantityInCart: `
    UPDATE ProductosCarrito
    SET Cantidad = @Cantidad
    FROM ProductosCarrito pc
    JOIN Carrito c ON pc.ID_Carrito = c.ID_Carrito
    WHERE c.ID_Usuario = @ID_Usuario AND pc.ID_Producto = @ID_Producto
    `,
    createOrder: `
        INSERT INTO Pedidos (ID_Usuario, Total, MetodoPago, DireccionEnvio, NombreReceptor, ApellidoReceptor, EstadoPedido)
        OUTPUT INSERTED.ID_Pedido
        VALUES (@ID_Usuario, @Total, @MetodoPago, @DireccionEnvio, @NombreReceptor, @ApellidoReceptor, 'Pendiente')
    `,
    addProductToOrder: `
        INSERT INTO DetallePedido (ID_Pedido, ID_Producto, Cantidad, PrecioUnitario)
        VALUES (@ID_Pedido, @ID_Producto, @Cantidad, @PrecioUnitario)
    `,
    cancelOrder: `
        UPDATE Pedidos
        SET EstadoPedido = 'Cancelado'
        WHERE ID_Pedido = @ID_Pedido
    `,
    getPedidosByUser: `
    SELECT 
      p.ID_Pedido,
      p.FechaCreacion,
      p.EstadoPedido,
      p.Total,
      p.DireccionEnvio,
      p.NombreReceptor,
      p.ApellidoReceptor,
      p.MetodoPago,
      JSON_QUERY((
        SELECT 
          pr.ID_Producto,
          pr.Producto,
          pr.Descripcion,
          d.Cantidad,
          d.PrecioUnitario,
          d.Subtotal
        FROM 
          DetallePedido d
          JOIN Producto pr ON d.ID_Producto = pr.ID_Producto
        WHERE 
          d.ID_Pedido = p.ID_Pedido
        FOR JSON PATH
      )) AS Productos
    FROM 
      Pedidos p
    WHERE
      p.ID_Usuario = @ID_Usuario
  `,
    addProduct: "INSERT INTO Producto (Producto, ID_Tipo, Descripcion, Precio, Stock, Cantidad) VALUES (@Producto, @ID_Tipo, @Descripcion, @Precio, @Stock, 1)",

    updateProduct: `
  UPDATE Producto
  SET Producto = COALESCE(@Producto, Producto),
      Precio = COALESCE(@Precio, Precio),
      Cantidad = COALESCE(@Cantidad, Cantidad)
  WHERE ID_Producto = @ID_Producto
`,
    deleteProduct: 'DELETE FROM Producto WHERE ID_Producto = @ID_Producto',
    checkOrderState: `
    SELECT EstadoPedido 
    FROM Pedidos 
    WHERE ID_Pedido = @ID_Pedido
  `,
  deleteCanceledOrder: `
    DELETE FROM Pedidos 
    WHERE ID_Pedido = @ID_Pedido
  `,
  getAllSalesData: `
  SELECT 
    p.ID_Pedido,
    p.FechaCreacion,
    p.EstadoPedido,
    p.Total,
    u.ID_Usuario,
    u.Nombre_Usuario,
    dp.ID_Producto,
    prod.Producto,
    prod.Precio,
    dp.Cantidad,
    prod.Descripcion,
    (SELECT COUNT(DISTINCT ID_Pedido) FROM Pedidos WHERE EstadoPedido != 'Cancelado') AS CantidadVentas,
    (SELECT COUNT(*) FROM Pedidos) AS CantidadPedidos,
    (SELECT COUNT(*) FROM Usuario) AS CantidadUsuarios
  FROM Pedidos p
  INNER JOIN Usuario u ON p.ID_Usuario = u.ID_Usuario
  INNER JOIN DetallePedido dp ON p.ID_Pedido = dp.ID_Pedido
  INNER JOIN Producto prod ON dp.ID_Producto = prod.ID_Producto
`,
updateOrderStatus: "UPDATE Pedidos SET EstadoPedido = @EstadoPedido WHERE ID_Pedido = @ID_Pedido",
getUserType: `
  SELECT TipoUsuario.Tipo
  FROM Usuario
  INNER JOIN TipoUsuario ON Usuario.ID_TipoUsuario = TipoUsuario.ID_TipoUsuario
  WHERE Usuario.ID_Usuario = @userId
`,
};

