export const querys = {
    checkUserExistence: "SELECT ID_Usuario FROM Usuario WHERE ID_Usuario = @ID_Usuario OR Nombre_Usuario = @Nombre_Usuario",
    insertUser: "INSERT INTO Usuario (ID_Usuario, Nombre_Usuario, ID_TipoUsuario) VALUES (@ID_Usuario, @Nombre_Usuario, 1)",
    getAllProducts: "SELECT p.ID_Producto, p.Producto, p.Descripcion, p.Precio, p.ID_Tipo, p.Stock, t.Tipo FROM Producto p LEFT JOIN Tipo t ON p.ID_Tipo = t.ID_Tipo",
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
        SELECT p.ID_Producto, p.Producto, p.Descripcion, p.Precio, p.Stock, t.Tipo, pc.Cantidad
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
    d.Cantidad, 
    d.PrecioUnitario, 
    pr.Producto as NombreProducto 
  FROM 
    Pedidos p 
    JOIN DetallePedido d ON p.ID_Pedido = d.ID_Pedido
    JOIN Producto pr ON d.ID_Producto = pr.ID_Producto
  WHERE 
    p.ID_Usuario = @ID_Usuario
`,
};
