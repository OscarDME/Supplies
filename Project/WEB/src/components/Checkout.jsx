import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import '../styles/Checkout.css';
import { config } from "../utils/conf";
import { useMsal } from "@azure/msal-react"; 


const Checkout = () => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const homeAccountId = activeAccount.homeAccountId;
    const parts = homeAccountId.split('-');
    const ID_Usuario = parts.slice(0, 5).join('-');
    console.log("ID_Usuario:", ID_Usuario);
    const location = useLocation();
    const { cartItems, total } = location.state || { cartItems: [], total: 0 };
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        direccion: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Datos del pedido
        const orderData = {
            ID_Usuario: ID_Usuario,
            Total: total,
            MetodoPago: "Tarjeta", // Sustituir por el método de pago seleccionado por el usuario
            DireccionEnvio: formData.direccion,
            NombreReceptor: formData.nombre,
            ApellidoReceptor: formData.apellido,
            productos: cartItems.map(item => ({
                ID_Producto: item.ID_Producto,
                Cantidad: item.Cantidad,
                PrecioUnitario: item.Precio
            }))
        };

        // Llamada al backend para crear el pedido
        const orderResponse = await fetch(`${config.apiBaseUrl}/createOrder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (orderResponse.ok) {
            const { ID_Pedido } = await orderResponse.json();
            // Ahora añadir cada producto al pedido
            for (const item of cartItems) {
                await fetch(`${config.apiBaseUrl}/addProductToOrder`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ID_Pedido: ID_Pedido,
                        ID_Producto: item.ID_Producto,
                        Cantidad: item.Cantidad,
                        PrecioUnitario: item.Precio
                    })
                });
            }
            navigate('/products'); // Redirigir a productos después de crear el pedido
        } else {
            console.error('Error al crear el pedido');
            // Manejar errores aquí
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-content">
                <div className="checkout-form">
                    <h1>Información de Envío</h1>
                    <form onSubmit={handleSubmit} className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="apellido">Apellido</label>
                            <InputText id="apellido" type="text" name="apellido" value={formData.apellido} onChange={handleChange} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="direccion">Dirección</label>
                            <InputText id="direccion" type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
                        </div>
                        <Button label="Confirmar Pedido" type="submit" className="p-button-success" />
                    </form>
                </div>
                <div className="cart-summary">
                    <h2>Resumen del Pedido</h2>
                    {cartItems.map(item => (
                        <div key={item.ID_Producto} className="cart-item-summary">
                            <span>{item.Producto} - {item.Cantidad} x ${item.Precio.toFixed(2)}</span>
                        </div>
                    ))}
                    <span>Total: ${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
